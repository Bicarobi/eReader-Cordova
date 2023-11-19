document.addEventListener("deviceready", onDeviceReady, false);

var currentBook;
var rendition;

function onDeviceReady() {
	// Cordova is now initialized. Have fun!
	//console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
	//document.getElementById("deviceready").classList.add("ready");

	$(document).ready(function () {
		LoadBook("Dark Matter.epub");

		var coversContainer1 = document.getElementById("coversContainer1");
		var coversContainer2 = document.getElementById("coversContainer2");
		var epubFiles = ["Dark Matter.epub", "Harry Potter.epub", "The Hobbit.epub", "Dune.epub", "Master of Middle Earth.epub"];

		epubFiles.forEach((epubFile) => {
			var bookCover = ePub("epubs/" + epubFile);
			bookCover.coverUrl().then((url) => {
				var newCover = new Image();
				var newCover2 = new Image();
				if (url != null) {
					newCover.src = url;
					newCover2.src = url;
				} else {
					newCover.src = "img/placeholder.png";
					newCover2.src = "img/placeholder.png";
				}
				newCover.classList.add("book-cover");
				newCover.onclick = function () {
					LoadBook(epubFile);
					currentBook = epubFile;
					CloseSidebar();
				};

				newCover2.classList.add("book-cover");
				newCover2.onclick = function () {
					LoadBook(epubFile);
					currentBook = epubFile;
				};

				coversContainer1.append(newCover);
				coversContainer2.append(newCover2);
			});
		});

		$("#menu-btn").click(OpenSidebar);
		$("#closeSidebar").click(CloseSidebar);
		$("#openOptions").click(OpenOptions);
		$("#closeOptions").click(CloseOptions);
		$("#refreshBook").click(ChangeOptions);

		var prevScrollpos = window.scrollY;
		window.onscroll = function () {
			var currentScrollPos = window.scrollY;
			var optionsOpen = $("#optionsContainer").css("top");
			console.log(optionsOpen);

			if (prevScrollpos < currentScrollPos && optionsOpen != "0px") {
				document.getElementById("navbar").style.top = "-40px";
			} else {
				document.getElementById("navbar").style.top = "0";
			}

			prevScrollpos = currentScrollPos;
		};
	});
}

function LoadBook(epubName) {
	$("#viewer").empty();

	var params = URLSearchParams && new URLSearchParams(document.location.search.substring(1));
	var url = params && params.get("url") && decodeURIComponent(params.get("url"));
	var currentSectionIndex = params && params.get("loc") ? params.get("loc") : undefined;

	// Load the opf
	var book = ePub(url || "epubs/" + epubName);
	rendition = book.renderTo("viewer", {
		manager: "continuous",
		flow: "scrolled",
		width: "100%",
		height: "100%",
	});

	var displayed = rendition.display(currentSectionIndex);

	ChangeOptions();

	displayed.then(function (renderer) {
		// -- do stuff
	});

	// Navigation loaded
	book.loaded.navigation.then(function (toc) {
		// console.log(toc);
	});
}

function OpenSidebar() {
	$("#sidebar").animate({ left: "0px" }, 500);
	//$("#content").animate({ marginLeft: "100%" }, 500);
}

function CloseSidebar() {
	$("#sidebar").animate({ left: "-100vw" }, 500);
	//$("#content").animate({ marginLeft: "0px" }, 500);
}

function OpenOptions() {
	$("#optionsContainer").animate({ top: "0px" }, 500);
	document.getElementById("navbar").style.top = "0";
	$("#closeOptions").show();
	$("#openOptions").hide();
}

function CloseOptions() {
	$("#optionsContainer").animate({ top: "-330px" }, 500);
	$("#openOptions").show();
	$("#closeOptions").hide();
	ChangeOptions();
}

function ChangeOptions() {
	var fontSize = $("#font-size").val();
	var lineSpacing = $("#line-spacing").val();
	var leftMargin = $("#left-margin").val();
	var rightMargin = $("#right-margin").val();
	var fontColor = $("#font-color").val();
	var backgroundColor = $("#background-color").val();
	var fontName = $("#font-name").val();

	rendition.themes.register("custom", {
		body: {
			background: backgroundColor,
		},
		"h1, h2, h3, p, span": {
			color: fontColor + " !important",
			"padding-left": leftMargin + "px !important",
			"padding-right": rightMargin + "px !important",
			"padding-bottom": lineSpacing + "px !important",
			margin: 0 + " !important",
			"font-family": fontName + " !important",
		},
		h1: { "font-size": fontSize * 1.45 + "px !important" },
		h2: { "font-size": fontSize * 1.3 + "px !important" },
		h3: { "font-size": fontSize * 1.15 + "px !important" },
		"p, span": { "font-size": fontSize + "px !important" },
	});

	rendition.themes.select("custom");
}
