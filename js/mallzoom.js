/*
	title	: mallzoom.js
	version	: 20171120
	license	: GPLv3
	author	: Inpyo Jeon (inpyodev@gmail.com)
*/

(function($){
	$.fn.mallzoom = function(options){
		var $obj = $(this).addClass('mallzoom_object');
		var opt = $.extend({
			imageFitType	: 'fit', // cover, fit
			thumbPosition	: 'bottom', // top, bottom, left, right
			thumbCount		: 5, // (int)
			outputPosition	: 'right', // top, bottom, left, right
			imageOverlay	: [], // (array)
			zoomScale		: 0.05, // (float)
			zoomMaximum		: 5, // (int)
			noticeText		: '', // (string)
			noticePosition	: 'bottom', // top, bottom
			noticeShowTime	: 2, // (sec)
			autoHideNav		: false // true, false
		}, options);
		
		// constants
		var _objWidth = $obj.innerWidth();
		var _objHeight = $obj.innerHeight();
		var _objRatio = _objWidth / _objHeight;
		var _imageFitType = opt.imageFitType;
		var _thumbPosition = opt.thumbPosition;
		var _thumbCount = opt.thumbCount;
		var _outputPosition = opt.outputPosition;
		var _imageOverlay = opt.imageOverlay;
		var _currentIndex = 0;
		var _zoomMaximum = opt.zoomMaximum;
		var _zoomInScale = 1 + opt.zoomScale;
		var _zoomOutScale = 1 - opt.zoomScale;
		var _noticeText = opt.noticeText;
		var _noticePosition = opt.noticePosition;
		var _noticeShowTime = opt.noticeShowTime * 1000;
		var _autoHideNav = opt.autoHideNav;
		
		markupGenerate(); // generate structure
		
		// elements
		var $frmInput = $obj.find('._frm_input');
		var $imgInput = $obj.find('._img_input');
		var $frmOverlay = $obj.find('._frm_overlay');
		var $imgOverlay = $obj.find('._img_overlay');
		var $frmMagnifier = $obj.find('._frm_magnifier');
		var $frmInMagnifier = $obj.find('._frm_in_magnifier');
		var $imgMagnifier = $obj.find('._img_magnifier');
		var $frmThumbnail = $obj.find('._frm_thumbnail');
		var $frmInThumbnail = $obj.find('._frm_in_thumbnail');
		var $wrapThumbnail = $obj.find('._wrap_thumbnail');
		var $navThumbnailPrev = $obj.find('._nav_thumbnail_prev');
		var $navThumbnailNext = $obj.find('._nav_thumbnail_next');
		var $imgThumbnail = $obj.find('._img_thumbnail');
		var $frmOutput = $obj.find('._frm_output');
		var $frmInOutput = $obj.find('._frm_in_output');
		var $imgOutput = $obj.find('._img_output');
		var $txtNotice = $obj.find('._txt_notice');
		
		frameStyle(); // style setup

		// responsive variables
		var cursorX, cursorY;
		var _offsetTop = $frmInput.offset().top;
		var _offsetLeft = $frmInput.offset().left;
		var timer = 0;
		
		$(window).on('load', init); // initialize
		
		$wrapThumbnail.on('mouseenter', navigateHover);
		$navThumbnailPrev.add($navThumbnailNext).on('click', navigateArrows);
		
		$frmOverlay.on('mouseenter', showMagnifier);
		$frmMagnifier.add($obj).on('mouseleave', hideMagnifier);
		$frmMagnifier.on('mousemove', moveMagnifier);
		$frmMagnifier.on('mousewheel', zoomMagnifier);
		
		function zoomOutput(_magnifierTop, _magnifierLeft){
			var _magWidth = $frmMagnifier.innerWidth();
			var _zoomRatio = _objWidth / _magWidth;
			var _zoomTop = _magnifierTop * _zoomRatio;
			var _zoomLeft = _magnifierLeft * _zoomRatio;
			
			$frmInOutput.css({ width: _objWidth * _zoomRatio, height: _objHeight * _zoomRatio, top: -_zoomTop, left: -_zoomLeft });
			$imgOutput.each(imageFit);
		}
		
		function showMagnifier(e){
			$frmMagnifier.add($frmOutput).addClass('_active');
			moveMagnifier(e);
			$txtNotice.show();
			timer = setTimeout(function(){ $txtNotice.fadeOut(400); }, _noticeShowTime);
		}
		
		function hideMagnifier(e){
			$frmMagnifier.css({ width: _objWidth/2, height: _objHeight/2 });
			$frmMagnifier.add($frmOutput).removeClass('_active');
			clearTimeout(timer);
			timer=0;
		}
		
		function moveMagnifier(e){
			getCursorOffset(e);
			
			var _magBorder = parseInt($frmMagnifier.css('border-top-width'));
			var _magWidth = $frmMagnifier.innerWidth();
			var _magHeight = $frmMagnifier.innerHeight();
			var _magnifierTop = cursorY - $frmMagnifier.innerHeight()/2;
			var _magnifierLeft = cursorX - $frmMagnifier.innerWidth()/2;
			
			if (_magnifierTop < 0) _magnifierTop = 0;
			if (_magnifierTop > _objHeight - _magHeight) _magnifierTop = _objHeight - _magHeight;
			if (_magnifierLeft < 0) _magnifierLeft = 0;
			if (_magnifierLeft > _objWidth - _magWidth) _magnifierLeft = _objWidth - _magWidth;
			
			$frmMagnifier.css({ top: _magnifierTop - _magBorder, left: _magnifierLeft - _magBorder });
			$frmInMagnifier.css({ top: -_magnifierTop, left: -_magnifierLeft });
			
			zoomOutput(_magnifierTop, _magnifierLeft);
		}
		
		function zoomMagnifier(e){
			var _magWidth = $frmMagnifier.innerWidth();
			var _magHeight = $frmMagnifier.innerHeight();
			
			if (e.originalEvent.wheelDelta > 0){ // wheel up
				if (_magWidth * _zoomOutScale > _objWidth / _zoomMaximum){
					_magWidth = _magWidth * _zoomOutScale;
					_magHeight = _magHeight * _zoomOutScale;
				} else {
					_magWidth = _objWidth / _zoomMaximum;
					_magHeight = _objHeight / _zoomMaximum;
				}
					
			} else { // wheel down
				if (_magWidth * _zoomInScale < _objWidth){
					_magWidth = _magWidth * _zoomInScale;
					_magHeight = _magHeight * _zoomInScale;
				} else {
					_magWidth = _objWidth;
					_magHeight = _objHeight;
				}
			}
			
			$frmMagnifier.css({ width: _magWidth, height: _magHeight });
			moveMagnifier(e);
			
			return false;
		}

		function getCursorOffset(e){
			cursorX = e.pageX - _offsetLeft;
			cursorY = e.pageY - _offsetTop;
		}
		
		function init(){
			$obj.addClass('_loaded');
			$imgInput.add($imgThumbnail).each(imageFit);
			showImage(_currentIndex);
		}	
			
		function markupGenerate(){
			var _markupNotice = _noticeText.length > 0 ? '<p class="_txt_notice">' + _noticeText + '</p>' : '';
			var _markup = '<div class="_frm_input"></div><div class="_frm_overlay"></div><div class="_frm_magnifier"><div class="_frm_in_magnifier"><img class="_img_magnifier" src=""></div></div><div class="_frm_thumbnail"><a class="_nav_thumbnail_prev" href="javascript:;"></a><a class="_nav_thumbnail_next" href="javascript:;"></a><div class="_frm_in_thumbnail"><ul></ul></div></div><div class="_frm_output">' + _markupNotice + '<div class="_frm_in_output"><img class="_img_output" src=""></div></div>';			
			$obj.append(_markup).find('> img').addClass('_img_input').appendTo($obj.find('._frm_input')).each(function(){ $obj.find('._frm_in_thumbnail > ul').append('<li class="_wrap_thumbnail"><img class="_img_thumbnail" src="' + ($(this).data('thumbsrc') ? $(this).data('thumbsrc') : $(this).attr('src')) + '"></li>'); });
			for(var i=0;i<_imageOverlay.length;i++){ $obj.find('._frm_overlay').append('<img class="_img_overlay _ioid_' + i + '" src="' + _imageOverlay[i] + '">'); }
			for(var i=0; i<_thumbCount; i++){ $obj.find('._wrap_thumbnail').eq(i).addClass('_showing'); }
		}
		
		function frameStyle(){
			var _frmThumbnailWidth, _frmThumbnailHeight, _frmThumbnailGap, _wrapThumbnailWidth, _wrapThumbnailHeight, _wrapThumbnailMargin, _frmOutputMargin;			
			var _objBorder = parseInt($obj.css('border-top-width')); // fallback for IE9+
			var _objBorderColor = $obj.css('border-top-color');
			var _objBorderStyle = $obj.css('border-top-style');
			var _objBgColor = $obj.css('background-color');
			var _frmMagnifierBorder = parseInt($frmMagnifier.css('border-top-width'));
			var _wrapThumbnailBorder = parseInt($wrapThumbnail.css('border-top-width'));
			var _frmThumbnailTop = 0;
			var _frmThumbnailLeft = 0;
			var _frmOutputTop = -_objBorder;
			var _frmOutputLeft = -_objBorder;
			var _navThumbnailWidth = parseInt($navThumbnailPrev.css('width'));
			var _navThumbnailHeight = parseInt($navThumbnailPrev.css('height'));
			var _navThumbnailBorder = parseInt($navThumbnailPrev.css('border-top-width'));
			
			var _frmThumbnailPadding = (!_autoHideNav && $imgInput.length > _thumbCount) ? _frmThumbnailPadding * 2 : 0;
			
			if (_noticeText.length > 0) {
				var _txtNoticePadding = parseInt($txtNotice.css('padding-left'));
				$txtNotice.addClass('_' + _noticePosition);
				$txtNotice.css({ width: _objWidth - _txtNoticePadding * 2 });
			}
			
			$frmInput.add($frmInMagnifier).add($frmOutput).add($frmInOutput).css({ width: _objWidth, height: _objHeight, backgroundColor: _objBgColor });
			$frmThumbnail.addClass('_' + _thumbPosition);
			$frmOutput.addClass('_' + _outputPosition);
			
			// thumbnail values
			if (_thumbPosition == 'top' || _thumbPosition == 'bottom'){				
				_frmThumbnailPadding = _autoHideNav && $imgInput.length <= _thumbCount ? 0 : parseInt($frmThumbnail.css('padding-left'));
				_frmThumbnailWidth = _objWidth + _objBorder * 2 - _frmThumbnailPadding * 2;
				_wrapThumbnailMargin = parseInt($wrapThumbnail.css('margin-right'));
				_wrapThumbnailWidth = (_frmThumbnailWidth - _wrapThumbnailMargin * (_thumbCount - 1) - _wrapThumbnailBorder * _thumbCount * 2) / _thumbCount;
				_wrapThumbnailHeight = _wrapThumbnailWidth / _objRatio;
				_frmThumbnailHeight = _wrapThumbnailHeight + _wrapThumbnailBorder * 2;
				_navThumbnailHeight = _wrapThumbnailHeight - _navThumbnailBorder * 2 + _wrapThumbnailBorder * 2;
				_frmThumbnailLeft = -_objBorder;
				if (_thumbPosition == 'top'){
					_frmThumbnailGap = parseInt($frmThumbnail.css('padding-bottom'));
					_frmThumbnailTop = -(_frmThumbnailHeight + _frmThumbnailGap + _objBorder);
				} else {
					_frmThumbnailGap = parseInt($frmThumbnail.css('padding-top'));
					_frmThumbnailTop = _objHeight + _objBorder;
				}
			} else {
				_frmThumbnailPadding = _autoHideNav && $imgInput.length <= _thumbCount ? 0 : parseInt($frmThumbnail.css('padding-top'));
				_frmThumbnailHeight = _objHeight + _objBorder * 2 - _frmThumbnailPadding * 2;
				_wrapThumbnailMargin = parseInt($wrapThumbnail.css('margin-bottom'));
				_wrapThumbnailHeight = (_frmThumbnailHeight - _wrapThumbnailMargin * (_thumbCount - 1) - _wrapThumbnailBorder * _thumbCount * 2) / _thumbCount;
				_wrapThumbnailWidth = _wrapThumbnailHeight * _objRatio;
				_frmThumbnailWidth = _wrapThumbnailWidth + _wrapThumbnailBorder * 2;
				_navThumbnailWidth = _wrapThumbnailWidth - _navThumbnailBorder * 2 + _wrapThumbnailBorder * 2;
				_frmThumbnailTop = -_objBorder;
				if (_thumbPosition == 'left'){
					_frmThumbnailGap = parseInt($frmThumbnail.css('padding-right'));
					_frmThumbnailLeft = -(_frmThumbnailWidth + _frmThumbnailGap + _objBorder);
				} else {
					_frmThumbnailGap = parseInt($frmThumbnail.css('padding-left'));
					_frmThumbnailLeft = _objWidth + _objBorder;
				}
			}
			
			// output values
			if (_outputPosition == 'top'){
				_frmOutputMargin = parseInt($frmOutput.css('margin-bottom'));
				_frmOutputTop = -(_frmOutputMargin + _objBorder);
			} else if (_outputPosition == 'bottom'){
				_frmOutputMargin = parseInt($frmOutput.css('margin-top'));
				_frmOutputTop = _objHeight + _objBorder;
			} else if (_outputPosition == 'left'){
				_frmOutputMargin = parseInt($frmOutput.css('margin-right'));
				_frmOutputLeft = -(_frmOutputMargin + _objBorder + _objWidth);
			} else{
				_frmOutputMargin = parseInt($frmOutput.css('margin-left'));
				_frmOutputLeft = _objWidth + _objBorder;
			}
			
			console.log(_objWidth)
			
			$frmThumbnail.css({ width: _frmThumbnailWidth, height: _frmThumbnailHeight, top: _frmThumbnailTop, left: _frmThumbnailLeft });
			$wrapThumbnail.css({ width: _wrapThumbnailWidth, height: _wrapThumbnailHeight, backgroundColor: _objBgColor });
			$frmOutput.css({ top: _frmOutputTop, left: _frmOutputLeft, borderWidth: _objBorder, borderColor: _objBorderColor, borderStyle: _objBorderStyle });
			$frmMagnifier.css({ width: _objWidth / 2, height: _objHeight / 2 });
			$navThumbnailPrev.add($navThumbnailNext).css({ width: _navThumbnailWidth, height: _navThumbnailHeight });
			if (_autoHideNav && $imgInput.length <= _thumbCount) $frmThumbnail.addClass('_hideComponent');
			
			var _objOriginalMargin = parseInt($obj.css('margin-' + _thumbPosition));
			var _navigationSize = _thumbPosition == 'top' || _thumbPosition == 'bottom' ? _frmThumbnailHeight + _frmThumbnailGap : _frmThumbnailWidth + _frmThumbnailGap;
			$obj.css('margin-' + _thumbPosition, _objOriginalMargin + _navigationSize); // stuffing
		}
		
		function navigateHover(){
			showImage($(this).index());
		}
		
		function navigateArrows(){			
			var _arrow = $(this);
			var _positionPrev = _thumbPosition == 'top' || _thumbPosition == 'bottom' ? $wrapThumbnail.eq(_currentIndex-1).position().left : $wrapThumbnail.eq(_currentIndex-1).position().top;
			var _positionNext = _thumbPosition == 'top' || _thumbPosition == 'bottom' ? $wrapThumbnail.eq(_currentIndex+2 - _thumbCount).position().left : $wrapThumbnail.eq(_currentIndex+2 - _thumbCount).position().top;
			
			if (_arrow.hasClass('_nav_thumbnail_prev')){
				if (_currentIndex > 0){
					if (!$wrapThumbnail.eq(_currentIndex-1).hasClass('_showing')){
						if (_thumbPosition == 'top' || _thumbPosition == 'bottom') $frmInThumbnail.find('ul').css({ left: -_positionPrev });
						else $frmInThumbnail.find('ul').css({ top: -_positionPrev });
						$wrapThumbnail.eq(_currentIndex-1).addClass('_showing');
						$wrapThumbnail.eq(_currentIndex-1 + _thumbCount).removeClass('_showing');
					}
					showImage(_currentIndex-1);
				}
			} else {
				if (_currentIndex < $imgInput.length-1){
					if (!$wrapThumbnail.eq(_currentIndex+1).hasClass('_showing')){
						if (_thumbPosition == 'top' || _thumbPosition == 'bottom') $frmInThumbnail.find('ul').css({ left: -_positionNext });
						else $frmInThumbnail.find('ul').css({ top: -_positionNext });
						$wrapThumbnail.eq(_currentIndex+1).addClass('_showing');
						$wrapThumbnail.eq(_currentIndex+1 - _thumbCount).removeClass('_showing');
					}
					showImage(_currentIndex+1);
				}
			}
		}
		
		function showImage(_index){			
			$imgInput.eq(_index).add($wrapThumbnail.eq(_index)).addClass('_active').siblings().removeClass('_active');
			$imgOutput.add($imgMagnifier).attr('src', $imgInput.eq(_index).attr('src')).each(imageFit);
			
			if (_index == 0) $navThumbnailPrev.addClass('_deactive');
			else $navThumbnailPrev.removeClass('_deactive');
			if (_index == $imgInput.length-1) $navThumbnailNext.addClass('_deactive');
			else $navThumbnailNext.removeClass('_deactive');
			
			_currentIndex = _index;
		}
		
		function imageFit(){
			var _img = $(this);
			var _imgWidth = natural(_img[0]).width;
			var _imgHeight = natural(_img[0]).height;
			var _imgRatio = _imgWidth / _imgHeight;
			var _parWidth = _img.parent().innerWidth();
			var _parHeight = _img.parent().innerHeight();
			var _parRatio = _parWidth / _parHeight;
			
			_img.css({ top:0, left:0, width: 'auto', height: 'auto' });
			
			if (_imageFitType == 'fit' && _imgRatio > _parRatio || _imageFitType == 'cover' && _imgRatio < _parRatio) _img.css({ width: _parWidth, top: (_parHeight - _parWidth / _imgRatio) / 2 });
			else _img.css({ height: _parHeight, left: (_parWidth - _parHeight * _imgRatio) / 2 });
		}
		
		function natural(_img) { // naturalWidth, naturalHeight fallback for IE8
			var img = new Image();
		  	img.src = _img.src;
		  	return { width: img.width, height: img.height };
		}
		
		return this;
	};
}(jQuery));