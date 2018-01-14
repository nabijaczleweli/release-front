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


SOURCES := $(sort $(wildcard src/*.js src/**/*.js src/**/**/*.js src/**/**/**/*.js))

.PHONY : all clean js index license

all : js index license

clean :
	rm -rf $(OUTDIR)

js : $(foreach l,$(subst src/,$(JSDIR),$(SOURCES)),$(l) $(subst .js,.min.js,$(l)))
index : $(OUTDIR)index.html
license : $(OUTDIR)LICENSE


$(OUTDIR)index.html : index.html.pp
	@mkdir -p $(dir $@)
	sed $^ -r $(foreach l,RELEASE_FRONT_VERSION_STR,-e 's/%%$(l)%%/$($(l))/g') > $@

$(OUTDIR)LICENSE : LICENSE
	@mkdir -p $(dir $@)
	cp $^ $@


$(JSDIR)%.js : $(SRCDIR)%.js
	@mkdir -p $(dir $@)
	$(BABEL) $(BABELAR) $^ --out-file $@

$(JSDIR)%.min.js : $(JSDIR)%.js
	@mkdir -p $(dir $@)
	$(MINIFYJS) $(MINIFYJSAR) -i $^ -o $@
