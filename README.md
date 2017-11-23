# mallzoom.js

mallzoom.js is a lightweight jQuery image zoom slider plugin for e-commerce websites.<br>Various customization options are available to create unique slider components for web pages.

### Requirements

- Modern web browsers include Internet Explorer 8+, Chrome, Firefox
- Web page includes jQuery 1.7+

### Features (v20171120)

- Image slider with a thumbnail navigation
- Image fitting over the parent element
- Partial zoomming on the input image
- Changing the zoom scale with mousewheel events
- Number of thumbnail navigations per page setting
- Position of the zoomed image and thumbnails setting
- Auto layout adjustment
- Notification message settings

### Usage

1 ) Load jQuery, mallzoom.js and mallzoom.css on the web page.

<pre>
<code>...
    &lt;link rel="stylesheet" href="css/mallzoom.css"&gt;
    &lt;script src="js/jquery-3.2.1.min.js"&gt;
    &lt;script src="js/mallzoom.js"&gt;
...</code>
</pre>

2 ) Wrap the input images with a wrapper element and add thumbnail URLs into each "data-thumbsrc" attribute(option).

<pre>
<code>&lt;div id="image-zoom"&gt;
    &lt;img src="img/img01.jpg" data-thumbsrc="img/img01_thumb.jpg"&gt;
    &lt;img src="img/img02.jpg" data-thumbsrc="img/img02_thumb.jpg"&gt;
    &lt;img src="img/img03.jpg" data-thumbsrc="img/img03_thumb.jpg"&gt;
    &lt;img src="img/img04.jpg"&gt;
    &lt;img src="img/img05.jpg"&gt;
&lt;/div&gt;</code>
</pre>

3 ) Set the basic properties(width, height, background, border...) of the root element.

<pre>
<code>...
    #image-zoom { width: 800px; height: 600px; border: 1px solid #aaa; background: #000; }
...</code>
</pre>

4 ) Call the plugin and set the option values after document ready. (Ref: [Options](#options))

<pre>
<code>&lt;script&gt;
    $('#img-zoom').mallzoom({
        imageFitType: 'cover',
        thumbCount: 4,
        zoomScale: 0.75
    });
&lt;/script&gt;</code>
</pre>

5 ) Review the object structure and customize style properties. (Ref: [Object Structure](#structure))

<pre>
<code>...
    #image-zoom ._frm_thumbnail { padding-left:20px; padding-right:20px; }
    #image-zoom ._nav_thumbnail_prev { background-image:url(img/arrow_left_on.gif); }
    #image-zoom ._nav_thumbnail_prev._deactive { background-image:url(img/arrow_left_off.gif); }
    #image-zoom ._nav_thumbnail_next { background-image:url(img/arrow_right_on.gif); }
    #image-zoom ._nav_thumbnail_next._deactive { background-image:url(img/arrow_right_off.gif); }
...</code>
</pre>

<a name="structure"></a>
### Object Structure

<pre>
<code>&lt;div class="mallzoom_object"&gt;
    &lt;div class="_frm_input"&gt; (Input Images Frame)
        &lt;img class="_img_input"&gt; (Input Image)
    &lt;/div&gt;
    &lt;div class="_frm_overlay"&gt; (Overlay Images Frame)
        &lt;img class="_img_overlay"&gt; (Overlay Image)
    &lt;/div&gt;
    &lt;div class="_frm_magnifier"&gt; (Magnifier Frame)
        &lt;div class="_frm_in_magnifier"&gt; (Magnifier Inner Frame)
            &lt;img class="_img_magnifier"&gt; (Magnifier Overlay Image)
        &lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="_frm_thumbnail"&gt; (Thumbnail Navigation Frame)
        &lt;a class="_nav_thumbnail_prev"&gt;&lt;/a&gt; (Thumbnail Paging Navigation: Previous)
        &lt;a class="_nav_thumbnail_next"&gt;&lt;/a&gt; (Thumbnail Paging Navigation: Next)
        &lt;div class="_frm_in_thumbnail"&gt; (Thumbnail Navigation Inner Frame)
            &lt;ul&gt;
                &lt;li class="_wrap_thumbnail"&gt; (Thumbnail Image Wrap)
                    &lt;img class="_img_thumbnail"&gt; (Thumbnail Image)
                &lt;/li&gt;
            &lt;/ul&gt;
        &lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="_frm_output"&gt; (Output Image Frame)
        &lt;p class="_txt_notice"&gt;&lt;/p&gt; (Notification Message)
        &lt;div class="_frm_in_output"&gt; (Output Image Inner Frame)
            &lt;img class="_img_output"&gt; (Output Image)
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/div&gt;</code>
</pre>

<a name="options"></a>
### Options

Option|Value (Default)|Description
--|--|---
**imageFitType**|'fit', 'cover'<br>(Default: 'fit')|Sets the type of image size adjustment according to the parent element.<br>"fit" avoids cropping image by fitting the image to the frame.<br>"cover" works just like "background-size:cover"
**thumbPosition**|'top', 'bottom', 'left', 'right'<br>(Default: 'bottom')|Sets the position of thumbnail navigation frame.<br>Size and the gap between the frames set automatically according to the padding and border-width.
**thumbCount**|Natural number<br>(Default: 5)| Sets the quantity of thumbnails shown in a page.<br>Thumbnail images' size sets automatically according to this value.
**outputPosition**|'top', 'bottom', 'left', 'right'<br>(Default: 'right')|Sets the position of the output image frame.<br>The gap between the frames sets automatically according to its margin.
**imageOverlay**|URL Array<br>(No default value)|Adds overlay images. "__ioid__[index]" class will be added to each image.
**zoomScale**|Float 0-1<br>(Default: 0.05)|Sets basic zoomming scale. Bigger value will make zoomming faster and skip more frames.
**zoomMaximum**|Natural number<br>(Default: 5)|Sets the maximum zoom scale. Zoomming speed doesn't change.
**noticeText**|String<br>(No default value)|Sets the notification text. Leave it blank will prevent the plugin from adding markups for notification element.
**noticePosition**|'top', 'bottom'<br>(Default: 'bottom')|Sets the position of notification message inside the output image frame.
**noticeShowTime**|Seconds<br>(Default: 2)|Sets the timeout value of notification message.
**autoHideNav**|true, false<br>(Default: false)|Turn on/off the auto-hiding of thumbnail navigation paging buttons.

### License
GPL v3.0 (Ref: [GPL v3.0 Definition](https://opensource.org/licenses/gpl-3.0.html))

### Known Issues
- Resizing window or changing layouts may cause an "e.page" calculation error.
- Background color may seen on the trims of output image when user zooms out.

### Contact
Inpyo Jeon (inpyodev@gmail.com)<br>https://github.com/inpyodev/mallzoom.js