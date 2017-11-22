# mallzoom.js

mallzoom.js는 온라인 쇼핑몰 상품 상세 페이지를 위해 개발된 jQuery 기반 이미지 확대, 슬라이더 플러그인입니다.<br>커스텀 옵션과 스타일 설정을 통해 다양한 스타일의 슬라이더 컴포넌트를 제작하여 웹 페이지에 삽입할 수 있습니다.

### 동작 환경

- Internet Explorer 8 이상 또는 Chrome, Firefox 등의 PC 웹 브라우저
- 1.7 버전 이상의 jQuery가 포함된 웹 페이지

### 주요 기능 (v20171120)

- 이미지 썸네일 슬라이더
- 프레임 기준 이미지 크기 맞춤 설정
- 이미지 부분 확대 출력
- 마우스 휠 스크롤 배율 단위 변경
- 슬라이드 썸네일 출력 갯수 설정
- 확대 이미지, 썸네일 위치 설정
- 썸네일 갯수에 따른 레이아웃 조정
- 알림말 내용, 출력시간 설정

### 사용방법 및 코드 예시

1 )  jQuery와 mallzoom.js, mallzoom.css 등 플러그인 구동에 필요한 리소스를 로드 순서에 맞게 불러옵니다.

<pre>
<code>...
    &lt;link rel="stylesheet" href="css/mallzoom.css"&gt;
    &lt;script src="js/jquery-3.2.1.min.js"&gt;
    &lt;script src="js/mallzoom.js"&gt;
...</code>
</pre>

2 ) 랩핑 태그 내부에 슬라이드 이미지를 넣고, 썸네일 이미지가 있다면 해당 url을 data-thumbsrc에 담습니다.

<pre>
<code>&lt;div id="image-zoom"&gt;
    &lt;img src="img/img01.jpg" data-thumbsrc="img/img01_thumb.jpg"&gt;
    &lt;img src="img/img02.jpg" data-thumbsrc="img/img02_thumb.jpg"&gt;
    &lt;img src="img/img03.jpg" data-thumbsrc="img/img03_thumb.jpg"&gt;
    &lt;img src="img/img04.jpg"&gt;
    &lt;img src="img/img05.jpg"&gt;
&lt;/div&gt;</code>
</pre>

3 ) 플러그인을 적용할 오브젝트의 높이, 너비, 배경, 보더 등 기본 속성을 지정합니다.

<pre>
<code>...
    #image-zoom { width: 800px; height: 600px; border: 1px solid #aaa; background: #000; }
...</code>
</pre>

4 ) 문서 로드 시점 이후 플러그인을 호출합니다. 인자 전달부에 수정할 옵션과 값을 입력합니다. (참고: [옵션 일람](#options))

<pre>
<code>&lt;script&gt;
    $('#img-zoom').mallzoom({
        imageFitType: 'cover',
        thumbCount: 4,
        zoomScale: 0.75
    });
&lt;/script&gt;</code>
</pre>

5 ) 플러그인 호출 후 재생성된 오브젝트의 구조를 확인하여 세부 속성을 수정합니다. (참고: [오브젝트 구조 목업](#structure))

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
### 오브젝트 구조 목업

<pre>
<code>&lt;div class="mallzoom_object"&gt;
    &lt;div class="_frm_input"&gt; (삽입 이미지 프레임)
        &lt;img class="_img_input"&gt; (삽입 이미지)
    &lt;/div&gt;
    &lt;div class="_frm_overlay"&gt; (오버레이 프레임)
        &lt;img class="_img_overlay"&gt; (오버레이 이미지)
    &lt;/div&gt;
    &lt;div class="_frm_magnifier"&gt; (돋보기 프레임)
        &lt;div class="_frm_in_magnifier"&gt; (돋보기 내부 프레임)
            &lt;img class="_img_magnifier"&gt; (돋보기 오버레이 이미지)
        &lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="_frm_thumbnail"&gt; (썸네일 프레임)
        &lt;a class="_nav_thumbnail_prev"&gt;&lt;/a&gt; (이동: 이전으로)
        &lt;a class="_nav_thumbnail_next"&gt;&lt;/a&gt; (이동: 다음으로)
        &lt;div class="_frm_in_thumbnail"&gt; (썸네일 내부 프레임)
            &lt;ul&gt;
                &lt;li class="_wrap_thumbnail"&gt; (썸네일 이미지 랩)
                    &lt;img class="_img_thumbnail"&gt; (썸네일 이미지)
                &lt;/li&gt;
            &lt;/ul&gt;
        &lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="_frm_output"&gt; (확대된 이미지 프레임)
        &lt;p class="_txt_notice"&gt;&lt;/p&gt; (알림말)
        &lt;div class="_frm_in_output"&gt; (확대된 이미지 내부 프레임)
            &lt;img class="_img_output"&gt; (확대된 이미지)
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/div&gt;</code>
</pre>

<a name="options"></a>
### 옵션 일람

옵션명|값 (기본값)|설명
--|--|---
**imageFitType**|'fit', 'cover'<br>(기본값: 'fit')|부모 엘리먼트에 대한 이미지의 크기 조정 방식을 지정합니다.<br>fit 방식은 이미지가 잘리지 않도록 너비와 높이 중 긴 값에 맞추며,<br>cover 방식은 배경이 보이지 않도록 짧은 값에 맞추어 크롭합니다.
**thumbPosition**|'top', 'bottom', 'left', 'right'<br>(기본값: 'bottom')|이미지 썸네일 네비게이션 프레임의 출력 위치를 설정합니다.<br>썸네일 네비게이션의 크기와 간격은 스타일에서 지정된 패딩, 보더<br>값에 따라 자동으로 설정됩니다.
**thumbCount**|자연수<br>(기본값: 5)| 화면에 표시될 썸네일 갯수를 지정합니다. 썸네일 갯수에 따라<br>썸네일 네비게이션의 크기가 자동으로 조정됩니다.
**outputPosition**|'top', 'bottom', 'left', 'right'<br>(기본값: 'right')|확대 이미지 프레임의 출력 위치를 지정합니다. 스타일에 지정된<br>마진 값에 따라 간격이 설정됩니다.
**imageOverlay**|URL 스트링 1차원 배열<br>(기본값 없음)|오버레이 이미지의 URL을 배열 형식으로 입력합니다. 각 인덱스에<br>따라 _ioid_[인덱스]라는 클래스가 이미지에 추가됩니다.
**zoomScale**|0 이상, 1 이하 소수<br>(기본값: 0.05)|마우스 휠 스크롤에 따른 확대/축소 배율 단위를 조정합니다.<br>1에 가까울수록 배율 변경 속도가 빠르고 단위 간격이 넓습니다.
**zoomMaximum**|자연수<br>(기본값: 5)|최대 확대 배율을 설정합니다. 숫자가 높을수록 더 높은 배율까지<br>확대할 수 있으며, 배율 변경 속도는 변하지 않습니다.
**noticeText**|스트링<br>(기본값 없음)|알림말 문구를 삽입합니다. 입력하지 않을 경우 마크업이 생성되지<br>않습니다.
**noticePosition**|'top', 'bottom'<br>(기본값: 'bottom')|알림말 문구가 출력될 위치를 설정합니다. 알림말은 확대 이미지<br>프레임 내부에 출력됩니다.
**noticeShowTime**|초 단위 자연수<br>(기본값: 2)|알림말이 표시될 시간을 설정합니다. 해당 초가 지나면 알림말이<br>사라집니다.
**autoHideNav**|true, false<br>(기본값: false)|썸네일 페이징 네비게이션 버튼 자동 숨김 기능의 활성화 여부를<br>설정합니다. 활성화 시, 이미지 수가 적어 페이징이 불필요한 경우<br>네비게이션 버튼이 출력되지 않고 레이아웃이 조정됩니다.

### 라이센스
해당 플러그인은 GPL 3.0 라이센스로 작성되었습니다. (참고: [라이센스 전문](https://opensource.org/licenses/gpl-3.0.html))

### 문의 및 제안
전인표 (inpyodev@gmail.com)
