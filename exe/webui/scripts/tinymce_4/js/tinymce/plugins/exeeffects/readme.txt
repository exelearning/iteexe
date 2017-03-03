HTML and CSS instructions

/* Accordion HTML */

	<div class="exe-fx exe-accordion">
		<div>
			<div class="fx-accordion-section">
				<a class="fx-accordion-title fx-accordion-title-0 fx-C1" href="#"><h2>Title A</h2></a>
				<div class="fx-accordion-content">
					<p>...</p>
				</div>
				<a class="fx-accordion-title fx-accordion-title-1 fx-C1" href="#"><h2>Title B</h2></a>
				<div class="fx-accordion-content">
					<p>...</p>
				</div>
			</div>
		</div>
	</div>

/* Tabs HTML */

	<div class="exe-fx exe-tabs">
		<ul class="fx-tabs">
			<li class="fx-current fx-C2"><a href="#">Title A</a></li>
			<li><a href="#">Title B</a></li>
		</ul>
		<div class="fx-tab-content fx-C2 fx-current fx-default-panel">
			<h2 class="sr-av">Title A</h2>
			<p>...</p>
		</div>
		<div class="fx-tab-content fx-C2">
			<h2 class="sr-av">Title B</h2>
			<p>...</p>
		</div>
	</div>

/* Pagination HTML */

	<div class="exe-fx exe-paginated">
		<ul class="fx-pagination">
			<li class="fx-prev-next fx-prev fx-disabled"><a href="#" title="Previous" onclick="return false"><span>◄</span></a></li>
			<li class="fx-current fx-C1"><a href="#" title="Title A">1</a></li>
			<li><a href="#" title="Title B">2</a></li>
			<li class="fx-prev-next fx-next"><a href="#" title="Next"><span>►</span></a></li>
		</ul>
		<div class="fx-page-content fx-C2 fx-current">
			<h2>Title A</h2>
			<p>...</p>
		</div>
		<div class="fx-page-content fx-C2">
			<h2>Title B</h2>
			<p>...</p>
		</div>
	</div>

/* Carousel HTML */

	<div class="exe-fx exe-carousel">
		<div class="fx-carousel-content fx-C2 fx-current">
			<h2>Title A</h2>
			<p>...</p>
		</div>
		<div class="fx-carousel-content fx-C2">
			<h2>Title B</h2>
			<p>...</p>
		</div>
			<ul class="fx-pagination fx-carousel-pagination">
			<li class="fx-carousel-prev-next fx-carousel-prev fx-disabled fx-C2"><a href="#" title="Previous"><span>◄</span></a></li>
			<li class="fx-current fx-C1" id="exe-carousel-3-0-link"><a href="#" title="Title A">1</a></li>
			<li><a href="#" title="Title B">2</a></li>
			<li class="fx-carousel-prev-next fx-carousel-next fx-C2"><a href="#" title="Next"><span>►</span></a></li>
		</ul>
	</div>
	
/* Timeline HTML */
	<div class="exe-fx exe-timeline">
		<div class="fx-timeline-toggler">
			<p><a href="#" class="fx-timeline-expand" style="background-color:...;color:...">Show</a></p>
		</div>
		<div class="fx-timeline-major">
			<h2 class="fx-timeline-marker"><span><a href="#" style="background:...">Heading 2</a></span></h2>
			<div class="fx-timeline-minor">
				<h3 class="fx-timeline-event-trigger"><a href="#" style="color:...">Heading 3</a></h3>
				<div class="fx-timeline-event">
					...
				</div>
			</div>
		</div>
		<div class="fx-timeline-major">
			...
		</div>
	</div>

/* CSS (colors) */

	The timeline has the same color as the text of your iDevice. 
	It's defined in its HTML (above) using "style". 
	Use !important in your content.css file to change it.

/* Simplified (just 3 colors) */

	.js .exe-accordion{
		background:#FFFFFF;
	}
	.exe-fx .fx-C1,.exe-fx .fx-C1 a{
		background:#333333;
	}
	.exe-fx .fx-C2,
	.exe-fx .fx-C2 a,
	.fx-pagination a{
		background:#ededed;
	}

	/* iDevices with emphasis */

		.emphasis1 .js .exe-accordion{
			background:#FFFFFF;
		}
		.emphasis1 .exe-fx .fx-C1,
		.emphasis1 .exe-fx .fx-C1 a{
			background:#333333;
		}
		.emphasis1 .exe-fx .fx-C2,
		.emphasis1 .exe-fx .fx-C2 a,
		.emphasis1 .fx-pagination a{
			background:#ededed;
		}
	
/* Or... */

	/* Accordion */

		.js .exe-accordion{
			background:#fff;
		}
		.exe-fx .fx-accordion-title,
		.exe-fx.exe-accordion h2{
			background:#333;
			color:#fff;
		}

	/* Tabs, Pagination, Carousel */

		.exe-tabs .fx-tabs .fx-current a,
		.exe-tabs .fx-tab-content,
		.exe-fx .fx-page-content,
		.exe-fx .fx-carousel-content,
		.fx-pagination a,
		.exe-fx .fx-carousel-pagination a{
			background:#ededed;
		}
		.fx-carousel-pagination .fx-current a,
		.fx-pagination .fx-current a,
		.fx-carousel-pagination .fx-carousel-prev-next a:hover{
			background:#333;
			color:#fff;
		}