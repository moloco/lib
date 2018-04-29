# Moloco SDK for Publisher

This document explains the steps to integrate with Moloco SDK for Publisher in order to monetize your mobile app.

## Moloco Javascript SDK for Publisher
Here you can find instructions to enable Moloco provided advertisements to your mobile app in case that the whole page is rendered by a WebView (or at least the area you want to display ad is wrapped in WebView).

### Request for Ad Unit ID
Please work with your Moloco representative to receive the ad unit ID for each distinct page. You have to provide the following information.
* Your publish name (e.g., Naver)
* Your app name (e.g., Band)
* Your app category - must be one of the [IAB categories](https://support.aerserv.com/hc/en-us/articles/207148516-List-of-IAB-Categories) (e.g., IAB14)
* Your ad unit type - either BANNER or NATIVE
* Your ad unit size (e.g., 640X100)

### Download SDK file
Now you need to download the recent version of Javascript SDK file at [moloco.js](moloco.js).

### Integrate in HTML
Assuming that your downloaded moloco.js file is located in the same directory as your html file, import the JS file in the header.

```html
  <script src="moloco.js"></script>
```

Now initialize Moloco SDK using the provided ad unit ID.

```html
  <script>
    // Initialize MolocoSDK.
    var bundle = "123456789"; // Replace with the actual app bundle.
    var idfa = "";  // Please fill in ADID passed from the native app side.
    var moloco = new MolocoSDK({
      idfa: idfa,
      ad_unit: "ced0f7207dee45f3b42b41afa3e07b6e",  // Must be replaced by the real ad unit ID.
      ad_type: AdType.BANNER,
      container_id: "moloco_ad_container",
      fallback_container_id: "moloco_ad_container_fallback",
      bundle: bundle,
      country_iso: "kr",
      width: 640,
      height: 100
    }); 
  </script>
```

From the sample code above, `bundle`, `idfa`, and `ad_unit` must be replaced by the proper values of your own. Please note that `idfa` comes from your native app code and you have to write relevant logic around your WebView initializer.

The rest part differs by which advertisement type you want to integrate with.

#### Banner Type
```html
<div id="moloco_ad_container_fallback">
  <img class="content" src="https://storage.googleapis.com/second_line/fallback_default.jpg"/>
</div>
<div id="moloco_ad_container"></div>
```

For banner type, you first need to prepare for two different `div`s: one with default or fallback image (in case that no ad is returned) and the empty one which the returned ad will replace the content.

Once you have those two `div`s in your code, you are ready to request Moloco ad using the following code.

```html
<script>
  // Request ad on load.
  moloco.requestAd();
</script>
```

Please refer to the [sample](sample.html) html file (keep in mind that the sample file is provided only for the demonstrative purposes - it's not meant to work with your app).

#### Native Type
With native type, you may want to load this rich content as the user scrolls down the page.

```html
  <div id="dynamic_content" style="overflow: scroll; width: 100%;"></div>
  <div id="loading" style="display: none; margin: auto;">
    <img src="https://storage.googleapis.com/second_line/loading.gif" width="100%"/>
  </div>
```

Therefore you need one `div` to repeatedly use to render the newly served ad and an optional `div` to show a loading image.

You may need an auxiliary Javascript function to render the ad content at your taste. The below code just shows one simple way to do so.

```javascript
    function getAdDiv(adDivID) {
      /***
       * This is an example of an ad div. Placeholders supported:
       * - Icon:
       * ---- The placeholder: "##ICON_IMAGE##"
       * ---- Will be replaced by: string - link to a source of an icon.
       * - Main Image:
       * ---- The placeholder: "##MAIN_IMAGE##"
       * ---- Will be replaced by: string - link to a source of the main image of an ad.
       * - Title:
       * ---- The placeholder: "##TITLE##";
       * - Text:
       * ---- The placeholder: "##TEXT##";
       * - Click Link:
       * ---- The placeholder: "##CLK##";
       * - Call-To-Action Text:
       * ---- The placeholder: "##CTA_TEXT##";
       */
      let adDiv = document.createElement("div");
      adDiv.id = adDivID;
      adDiv.innerHTML = `
        <table id="molocoads_view">
          <tr class="ad_header">
            <td rowspan="2"><img src="##ICON_IMAGE##"></td>
            <td>
              <h2 id="title">##TITLE##</h2>
            </td>
          </tr>
          <tr>
            <td><a class="action_button" href="##CLK##"> ##CTA_TEXT## </a></td>
          </tr>
          <tr>
            <td colspan="2"><p id="text">##TEXT##</p></td>
          </tr>
          <tr>
            <td colspan="2">
              <a id="molocoads_link" href="##CLK##" target="_blank">
                <img id="native_main_image" src="##MAIN_IMAGE##"/>
              </a>
            </td>
          </tr>
        </table>`.replace(/\>\s+/g, '>'); // Minify  (i.e., remove all unnecessary spaces) html.

      return adDiv;
    }
```

To dynamically request ad and render it accordingly, you may want to refer to the following code (details must vary by pages).
```javascript
    let contentDiv = document.getElementById("dynamic_content");
    let loadingDiv = document.getElementById("loading");
    let adCount = 0;
    $(window).scroll(function () {
      if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
        loadingDiv.style.display = "block";
        // Below logic must be called only when it's time to request ad.
        {
          const adId = "ad-" + adCount;
          adCount++;
          let adDiv = getAdDiv(adId);
          adDiv.style.display = "none";
          moloco.requestAd(document.getElementById(adId));
        }
        loadingDiv.style.display = "none";
      }
    }
```

Please refer to the [sample](sample_native.html) html file (keep in mind that the sample file is provided only for the demonstrative purposes - it's not meant to work with your app).

## Moloco Android SDK for Publisher
N/A

## Moloco iOS SDK for Publisher
N/A
