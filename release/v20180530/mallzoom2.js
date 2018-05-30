/*
	Title	: mallzoom.js (jQuery Zoom Slider Plugin)
	Version	: 20180530 (IE8+)
	License	: GPLv3
	Author	: Inpyo Jeon (inpyodev@gmail.com)
	Website	: http://j-labs.io/api/mallzoomjs
*/

(function($){
	$.fn.mallzoom = function(options){
		var $obj = $(this).addClass('mallzoom_object');
		var opt = $.extend({ // Options
			imageFitType	: 'fit', // cover, fit
			thumbPosition	: 'bottom', // top, bottom, left, right
			thumbCount		: 5, // (int)
			outputPosition	: 'right', // top, bottom, left, right
			imageOverlay	: [], // (string array)
			zoomScale		: 0.05, // (float)
			zoomMaximum		: 5, // (int)
			noticeText		: '', // (string)
			noticePosition	: 'bottom', // top, bottom
			noticeShowTime	: 2, // (seconds)
			autoHideNav		: false, // true, false
			reverseZoom		: false // true, false
		}, options);
		
		/* Initialization */
		markupGenerate();

		/* Structure */
		function markupGenerate(){
			var _markupNotice = _noticeText.length > 0 ? '<p class="_txt_notice">' + _noticeText + '</p>' : '';
			var _markup = '<div class="_frm_input"></div><div class="_frm_overlay"></div><div class="_frm_magnifier"><div class="_frm_in_magnifier"><img class="_img_magnifier" src=""></div></div><div class="_frm_thumbnail"><a class="_nav_thumbnail_prev" href="javascript:;"></a><a class="_nav_thumbnail_next" href="javascript:;"></a><div class="_frm_in_thumbnail"><ul></ul></div></div><div class="_frm_output">' + _markupNotice + '<div class="_frm_in_output"><img class="_img_output" src=""></div></div>';			
			$obj.append(_markup).find('> img').addClass('_img_input').appendTo($obj.find('._frm_input')).each(function(){ $obj.find('._frm_in_thumbnail > ul').append('<li class="_wrap_thumbnail"><img class="_img_thumbnail" src="' + ($(this).data('thumbsrc') ? $(this).data('thumbsrc') : $(this).attr('src')) + '"></li>'); });
			for(var i=0;i<_imageOverlay.length;i++){ $obj.find('._frm_overlay').append('<img class="_img_overlay _ioid_' + i + '" src="' + _imageOverlay[i] + '">'); }
			for(var i=0; i<_thumbCount; i++){ $obj.find('._wrap_thumbnail').eq(i).addClass('_showing'); }			
		}
		
		/* Image loading */
		function imageFit(){ // Image-frame fitting
			var $img = $(this);
			var _img = { width: naturalSize($img[0]).width, height: naturalSize($img[0]).height, ratio: width / height }; // Image properties
			var _frame = { width: $img.parent().innerWidth(), height: $img.parent().innerHeight(), ratio: width / height }; // Frame properties
			
			$img.css({ top:0, left:0, width:'auto', height:'auto' }); // Reset object properties			
			if (_imageFitType == 'fit' && _img.ratio > _frame.ratio || _imageFitType == 'cover' && _img.ratio < _frame.ratio)
				$img.css({ width: _frame.width, top: (_frame.height - _frame.width / _img.ratio) / 2 });
			else
				$img.css({ height: _frame.height, left: (_frame.width - _frame.height * _img.ratio) / 2 });
		}
				
		function naturalSize(input){ // naturalWidth, naturalHeight fallback for IE8-
			var copy = new Image(); // Pseudo-image
			
			copy.src = input.src;
			
			return { width: copy.width, height: copy.height };
		}
		
		return this;
	};
}(jQuery));