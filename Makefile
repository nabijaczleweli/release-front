# The MIT License (MIT)

# Copyright (c) 2018 nabijaczleweli

# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
# the Software, and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
# FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
# COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
# IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


include configMakefile


# Args: $<, $@, additional defines
# `cpp` doesn't like Unicode paths so we do some fuckery for it to not choke thereon
preprocess_file = cd $(dir $(1)) && $(CPP) $(notdir $(1)) -P -DDATE_TIME="$(shell date "+%d.%m.%Y %H:%M:%S %Z")" -DFILE_NAME="$(1)" -DFILE_NAME_STUB="$(patsubst src/%/,%,$(dir $(1)))" $(DEFAULT_DEFINES) $(ADDITIONAL_TRAVIS_ARGS) $(3) | $(SED) -re "s;COLON_SLASH_SLASH;://;g" -e "s/<!--([[:space:]'\"]*<!--[[:space:]'\"]*)*-->//g" -e "s/FORCED_NEWLINE/\\n/g" -e "s;SLASH_ASTERIX;/*;g" -e "s;/\\*([[:space:]]*(/\\*)*[[:space:]]*)*\\*/;;g" -e "s/​FORCED_SPACER​//g" -e "s/FORCED_MINUS/-/g" -e "s/HASH/\#/g" -e "s/[[:space:]]+^/\\n/g" > $(CURDIR)/$(2)


DEFAULT_DEFINES := $(foreach l,RELEASE_FRONT_VERSION_STR,-D$(l)=$($(l)))
DEFAULT_SUBS := $(foreach l,RELEASE_FRONT_VERSION_STR,-e 's/$(l)/$($(l))/g')
ASSETS := $(sort $(wildcard assets/*.* assets/**/*.* assets/**/**/*.* assets/**/**/**/*.*))
LICENSES := $(sort $(wildcard LICENSE*))
TEST_SOURCES := $(sort $(wildcard $(TSTDIR)*.js $(TSTDIR)**/*.js $(TSTDIR)**/**/*.js $(TSTDIR)**/**/**/*.js))
JAVASCRIPT_SOURCES := $(sort $(wildcard src/*.js src/**/*.js src/**/**/*.js src/**/**/**/*.js))
PREPROCESSOR_SOURCES := $(sort $(wildcard src/*.pp src/**/*.pp src/**/**/*.pp src/**/**/**/*.pp))


.PHONY : all clean assets js preprocess licenses tests run-tests

all : assets js preprocess licenses tests run-tests

clean :
	rm -rf $(OUTDIR)

run-tests : $(subst $(TSTDIR),$(BLDDIR)$(TSTDIR),$(TEST_SOURCES)) $(subst src/,$(OUTDIR),$(JAVASCRIPT_SOURCES))
	$(foreach l,$(filter-out $(subst src/,$(OUTDIR),$(JAVASCRIPT_SOURCES)),$^),$(PHANTOMJS) $(l) && echo &&) :

assets : $(foreach l,$(subst $(ASSETDIR),$(OUTDIR),$(ASSETS)),$(l))
js : $(foreach l,$(subst src/,$(OUTDIR),$(JAVASCRIPT_SOURCES)),$(l) $(subst .js,.min.js,$(l)))
tests : $(subst $(TSTDIR),$(BLDDIR)test/,$(TEST_SOURCES))
preprocess : $(patsubst src/%.pp,$(OUTDIR)%,$(PREPROCESSOR_SOURCES))
licenses : $(foreach l,$(LICENSES),$(OUTDIR)$(l))


$(OUTDIR)%.js : $(SRCDIR)%.js
	@mkdir -p $(dir $@)
	$(BABEL) $(BABELAR) $^ | $(SED) $(DEFAULT_SUBS) > $@

$(OUTDIR)%.min.js : $(OUTDIR)%.js
	@mkdir -p $(dir $@)
	$(MINIFYJS) $(MINIFYJSAR) -i $^ -o $@

$(BLDDIR)test/%.js : $(TSTDIR)%.js
	@mkdir -p $(dir $@)
	@mkdir -p $(BLDDIR)test-remote/
	$(AWK) -f "extract-preloads.awk" -v out_dir="$(abspath $(BLDDIR)test-remote)/" -v rel_path="$(shell realpath --relative-to="$(dir $@)" "$(BLDDIR)test-remote")/" $^ > $@
	$(BABEL) $(BABELAR) $^ >> $@

$(OUTDIR)% : src/%.pp
	@mkdir -p $(dir $@)
	$(call preprocess_file,$<,$@,)

$(OUTDIR)% : assets/%
	@mkdir -p $(dir $@)
	cp $^ $@

# Not LICENSE% because % cannot be empty for some reason
$(OUTDIR)LICENS% : LICENS%
	@mkdir -p $(dir $@)
	cp $^ $@
