# Ad Serving
Moloco provides a single endpoint to access its ad serving functionality. Moloco currently supports image (either banner or interstitial) and native ad types.

## Request Ad
```javascript
GET https://exchange.adsmoloco.com/ad
```

### Table Test
| head1        | head two          | three |
|:-------------|:------------------|:------|
| ok           | good swedish fish | nice  |
| out of stock | good and plenty   | nice  |
| ok           | good `oreos`      | hmm   |
| ok           | good `zoute` drop | yumm  |

### Header Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| API-Key | string | API key for your organization issued by Moloco. |
| User-Agent | string | Browser's user agent string. |

### Query Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| `mobile_web` | boolean | Indicates this request comes from mobile web, not mobile app. |
| `id` | string | Ad Unit ID that identifis the ad placement (must be issued by Moloco). |
| `udid` | string | Unique Device ID. It consists of ID type and ID value delimitered by `:` (e.g., ifa:bfd3d66e-0c23-4005-ac00-74292f7168ac). Currently only ID type `ifa` (Identifier For Advertisers) is supported and the value is expected to be Android's GAID or iOS's IDFA. |
| `ufid` | string | Unique Request ID to identify this ad request from others, preferably a GUID. |
| `o` | string | Screen orientation: `l` for landscape, `p` for portrait. |
| `w` | integer | Screen width. |
| `h` | integer | Screen height. |
| `iso` | string | ISO 3166-1 standard alpha-2 (2 characters) country code (e.g., us, kr). |
| `bundle` | string | Bundle ID (package name) in case of mobile app. |
| `assets` | string | Comma separated list of required assets in case of native ad request: `title`, `text`, `iconimage`, `mainimage`, `ctatext`, `starrating`. This also serves as the indicator of native ad request. |

### Response
Content-type of the response is different by the request ad type (image or native).

#### Image
* Content-type: text/html
* Content: HTML snippet including image URL, click link and impression tracking links.
* Sample request and response (only demonstration purposes, the link doesn't work)

```
https://exchange.adsmoloco.com/ad?mobile_web=1&id=dd8429593bef4a26994577128e544e0e&udid=ifa:9759e029-e270-4841-83c0-477963c97747&bundle=com.moloco.app&iso=us&w=640&h=100&o=l&ufid=6905aeb1-85df-4e43-8cb8-214484dff514
```
```html
<span id="molocoads_view">
  <div>
    <span style="position:absolute; left:100%;">
      <span style="position:relative; z-index:30; float:right;">
        <a href="https://cdn-f.adsmoloco.com/moloco-cdn/privacy.html" target="_blank">
          <img src="https://cdn-f.adsmoloco.com/moloco-creative/privacy.png" height="16" border="0" style="margin: 0px 0px 0px -16px; float: left;" >
        </a>
      </span>
    </span>
  </div>
  <div>
    <a id="molocoads_link" href="https://click.here" target="_blank">
      <img id="__mimg" src="https://some.cdn/image.jpg"/>
    </a>
  </div>
</span>
<span id="molocoads_pixel" style="display:none;">
  <img src="https://impression.track" height="1" width="1">
</span>
```

#### Native
* Content-type: application/json
* Content: JSON struct with following entries.
  * `clk` click link
  * `clktracker` alternative click tracking link to report click action
  * `imptracker` LIST of impression tracking URLs
  * `iconimage` icon image file path
  * `mainimage` main image file path
  * `title` title text string
  * `text` content text string
  * `ctatext` Call-To-Action button text
  * `starrating` star rating value in case of mobile app advertisement
* Sample request and response (only demonstration purposes, the link doesn't work)

```
https://exchange.adsmoloco.com/ad?mobile_web=1&id=dd8429593bef4a26994577128e544e0e&udid=ifa:9759e029-e270-4841-83c0-477963c97747&bundle=com.moloco.app&iso=us&w=1200&h=628&o=l&ufid=1880ef07-45b3-46a9-8141-f5f4d3627e4d&assets=title%2Ctext%2Ciconimage%2Cmainimage%2Cctatext
```
```javascript
{
  "clk":"https://click.here",
  "clktracker":"https://click.report.here",
  "ctatext":"Book Now",
  "iconimage":"https://some.cdn/icon.jpg",
  "imptracker":[
    "https://track1.here",
    "https://track2.here"
  ],
  "mainimage":"https://some.cdn/main.jpg",
  "text":"Monetize your app with Moloco",
  "title":"Moloco, the ultimate marketing platform"
}
```

# Ad Managing
You will need to manage your ad unit details. Below APIs are currenly not fully supported. Please work with your Moloco representative if you want to create or update your ad unit.

## Create/Update Ad Unit

## List Ad Units

## Get Ad Unit

## Delete Ad Unit
