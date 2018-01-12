SLASH_ASTERIX
roboto-slab (c) by nabijaczleweli@gmail.com (nabijaczleweli)
​
roboto-slab is licensed under the MIT License.
​
You should have received a copy of the license along with this
work. If not, see <https://opensource.org/licenses/MIT>.
*/


#include "../util.h"


#define DEJAVU_FACE(lstyle, cstyle, wght)                     FORCED_NEWLINE \
	@font-face {                                                FORCED_NEWLINE \
		font-family: "DejaVu Sans Mono";                          FORCED_NEWLINE \
		font-style: lstyle;                                       FORCED_NEWLINE \
		font-weight: wght;                                        FORCED_NEWLINE \
		src: local("DejaVu Sans Mono Oblique"),                   FORCED_NEWLINE \
		     url(STR(../font/DejaVu/DejaVuSansMono##cstyle.ttf))                 \
		       format("truetype");                                FORCED_NEWLINE \
	}


DEJAVU_FACE(normal,                         , normal)
DEJAVU_FACE(normal,  FORCED_MINUSBold       , bold )
DEJAVU_FACE(oblique, FORCED_MINUSBoldOblique, bold )
DEJAVU_FACE(oblique, FORCED_MINUSOblique    , normal)


.dejavu, code, samp, pre, tt {
	font-family: "DejaVu Sans Mono", monospace;
	/* Normalise to "default" size (23px->22px) */
	font-size: calc(22em / 23);
}

.dejavu-unscale {
	/* Normalise to "normal" size (e.g. for other fonts) ((23px->22px)->23px) */
	font-size: calc(23em / 22);
}

.dejavu-em {
	font-family: "DejaVu Sans Mono", monospace;
}
