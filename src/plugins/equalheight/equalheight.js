/**
 * @title WET-BOEW Responsive equal height
 * @overview Sets the same height for all elements in a container that are rendered on the same baseline (row). Adapted from http://codepen.io/micahgodbolt/pen/FgqLc.
 * @license wet-boew.github.io/wet-boew/License-en.html / wet-boew.github.io/wet-boew/Licence-fr.html
 * @author @thomasgohard
 */
(function( $, window, wb ) {
"use strict";

/*
 * Variable and function definitions.
 * These are global to the plugin - meaning that they will be initialized once per page,
 * not once per instance of plugin on the page. So, this is a good place to define
 * variables that are common to all instances of the plugin on a page.
 */
var selector = ".wb-equalheight",
	$document = wb.doc,

	/**
	 * Init runs once per plugin element on the page. There may be multiple elements.
	 * It will run more than once per plugin if you don't remove the selector from the timer.
	 * @method init
	 * @param {jQuery Event} event Event that triggered this handler
	 */
	init = function( event ) {

		// Filter out any events triggered by descendants
		if ( event.currentTarget === event.target ) {
			wb.remove( selector );

			// Remove the event handler since only want init fired once per page (not per element)
			$document.off( "timerpoke.wb", selector );

			onResize();
		}
	},

	/**
	 * Re-equalise any time the window/document or a child element of 'selector' is resized.
	 * @method onResize
	 */
	onResize = function() {
		var $elm = $( selector ),
			$children = $elm.children(),
			row = [ ],
			rowTop = -1,
			currentChild,
			currentChildTop = -1,
			currentChildHeight = -1,
			tallestHeight = -1,
			i;

		for ( i = $children.length - 1; i >= 0; i-- ) {
			currentChild = $children[ i ];

			// Ensure all children that are on the same baseline have the same 'top' value.
			currentChild.style.verticalAlign = "top";

			// Remove any previously set min height
			currentChild.style.minHeight = 0;

			currentChildTop = currentChild.offsetTop;
			currentChildHeight = currentChild.offsetHeight;

			if ( currentChildTop !== rowTop ) {
				setRowHeight( row, tallestHeight );

				rowTop = currentChildTop;
				tallestHeight = currentChildHeight;
			} else {
				tallestHeight = (currentChildHeight > tallestHeight) ? currentChildHeight : tallestHeight;
			}

			row.push( currentChild );
		}

		setRowHeight( row, tallestHeight );
	},

	/**
	 * @method setRowHeight
	 * @param {array} row The rows to be updated
	 * @param {integer} height The new row height
	 */
	setRowHeight = function( row, height ) {
		// only set a height if more than one element exists in the row
		if ( row.length > 1 ) {
			for ( var i = row.length - 1; i >= 0; i-- ) {
				row[ i ].style.minHeight = height + "px";
			}
		}
		row.length = 0;
	};

// Bind the init event of the plugin
$document.on( "timerpoke.wb", selector, init );

// Handle text and window resizing
$document.on( "txt-rsz.wb win-rsz-width.wb win-rsz-height.wb tables-draw.wb", onResize );

// Add the timer poke to initialize the plugin
wb.add( selector );

})( jQuery, window, wb );
