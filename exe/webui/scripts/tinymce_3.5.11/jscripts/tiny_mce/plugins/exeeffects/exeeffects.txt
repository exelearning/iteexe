HTML and CSS instructions

/* Accordion HTML */

	<div class="exe-fx exe-accordion">
		<div>
			<div class="exe-accordion-section">
				<!-- Accordion block -->
				<a class="exe-accordion-title" href="#"><h2>Heading 2</h2></a>
				<div class="exe-accordion-content">
					...
				</div>
				<!-- / Accordion block -->
			</div>
		</div>
	</div>

/* Tabs HTML */

	<div class="exe-fx exe-tabs">
		<ul class="fx-nav tabs">
			<li class="current"><a href="#" onclick="">Heading 2</a></li>
			<li><a href="#" onclick="">Heading 2</a></li>
		</ul>
		<div class="fx-content tab-content current default-panel">
			<h2 class="sr-av">Heading 2</h2>
			...
		</div>
		<div class="fx-content tab-content">
			<h2 class="sr-av">Heading 2</h2>
			...
		</div>
	</div>

/* Pagination HTML */

	<div class="exe-fx exe-paginated">
		<ul class="fx-nav fx-pagination">
			<li class="fx-pg fx-prev disabled"><a href="#" title="Previous">◄</a></li>
			<li class="current"><a href="#" onclick="" title="Heading 2">1</a></li>
			<li><a href="#" onclick="" title="Heading 2">2</a></li>
			<li class="fx-pg fx-next"><a href="#" title="Next" onclick="">►</a></li>
		</ul>
			<div class="fx-content page-content current">
			<h2>Heading 2</h2>
			...
		</div>
		<div class="fx-content page-content">
			<h2>Heading 2</h2>
			...
		</div>
	</div>

/* Carousel HTML */

	<div class="exe-fx exe-carousel">
		<div class="fx-content carousel-page-content current">
			<h2>Heading 2</h2>
			...
		</div>
		<div class="fx-content carousel-page-content">
			<h2>Heading 2</h2>
			...
		</div>
		<ul class="carousel-pagination">
			<li class="exe-carousel-pg exe-carousel-prev disabled"><a href="#" title="Previous"><span>◄</span></a></li>
			<li class="current"><a href="#" onclick="" title="Heading 2">1</a></li>
			<li><a href="#" onclick="" title="Heading 2">2</a></li>
			<li class="exe-carousel-pg exe-carousel-next"><a href="#" title="Next" onclick=""><span>►</span></a></li>
		</ul>
	</div>

/* CSS (colors) */

/* Accordion */

	.js .exe-accordion{
		box-shadow:0px 1px 3px rgba(0,0,0,0.25);
		background:#fff;
	}
	.exe-accordion-title,
	.exe-accordion h2{
		border-bottom-color:#1a1a1a;
		background:#333;
		text-shadow:0px 1px 0px #1a1a1a;
		color:#fff;
	}
	.exe-accordion-title.active,
	.exe-accordion-title:hover{
		background:#4c4c4c;
	}

/* Tabs, Pagination, Carousel */

	.exe-tabs .tabs .current a,
	.exe-tabs .tab-content,
	.page-content,
	.carousel-page-content,
	.fx-pagination a,
	.carousel-pagination a{
		background:#ededed;
	}
	.carousel-pagination .current a,
	.fx-pagination .current a,
	.carousel-pagination .exe-carousel-pg a:hover{
		background:#333;
		color:#fff;
	}

/* Tabs, Pagination, Carousel (simplified) */

	.exe-fx .fx-content,
	.exe-fx .fx-nav .current a,
	.exe-fx .carousel-pagination a:hover {
		background:#000;
		color:#FFF;
	}

	.exe-fx .fx-pagination a,
	.carousel-pagination a {
		background:blue;
		color:yellow;
	}