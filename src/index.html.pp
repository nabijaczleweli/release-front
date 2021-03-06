<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />

		<link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon" />

		<link href="//nabijaczleweli.xyz/content/writing/the_taste_of_mi/Merriweather-font.css" rel="stylesheet" />
		<link href="//nabijaczleweli.xyz/content/writing/Roboto-font.css" rel="stylesheet" />
		<link href="css/DejaVu-Sans-Mono.css" rel="stylesheet" />

		<link href="css/common.css" rel="stylesheet" />
		<link href="css/search.css" rel="stylesheet" />
		<link href="css/footer.css" rel="stylesheet" />
		<link href="css/main-display.css" rel="stylesheet" />

		<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/platform/1.3.5/platform.min.js"></script>
		<script type="text/javascript" src="js/lib/node-enum.min.js"></script>
		<script type="text/javascript" src="js/util.min.js"></script>
		<script type="text/javascript" src="js/platform-detect.min.js"></script>
		<script type="text/javascript" src="js/url.min.js"></script>
		<script type="text/javascript" src="js/assets.min.js"></script>
		<script type="text/javascript" src="js/select.min.js"></script>
		<script type="text/javascript" src="js/title.min.js"></script>
		<script type="text/javascript" src="js/search.min.js"></script>
		<script type="text/javascript" src="js/main-display.min.js"></script>

		<title>release-front</title>
	</head>

	<body class="roboto">

<div id="search">
	<h1 class="smallcaps merriweather">release-front</h1>
	<input id="search-input" class="roboto-em" placeholder="Repository slug/URL" type="text" spellcheck="false" />
	<div class="link-box link-box-small">
		<a id="search-button" class="no-decoration big-button link-button">
			<samp>
				Get release
			</samp>
		</a>
	</div>
</div>

<div id="main-display" class="hidden">
	<a href="#" class="no-decoration main-heading-link">
		<img src="" id="main-logo" class="logo hidden" />
	</a>
	<a href="#" class="no-decoration main-heading-link">
		<h1 class="smallcaps merriweather repo-name main-repo-name">…</h1>
	</a>

	<p id="main-repo-line">
		<em>
			This will download the <a href="#" class="main-latest-link">latest version from <samp class="main-repo-name">…</samp>'s<!--'--> GitHub page</a>.
		</em>
	</p>

	<div class="link-box">
		<a id="main-button" class="no-decoration big-button link-button">
			<samp>
				Download <span class="main-platform-precedent">for</span> <span class="main-platform">UNKNOWN</span>
			</samp>
		</a>
	</div>

	<p id="main-latest-line" class="smol">
		<em>
			Latest version is <a href="#" class="main-latest-link"><samp class="main-version">UNKNOWN</samp></a>.
		</em>
	</p>
</div>

<footer>
	<a href="https://github.com/nabijaczleweli/release-front">release-front</a> <samp>RELEASE_FRONT_VERSION_STR</samp>
</footer>


	</body>
</html>

