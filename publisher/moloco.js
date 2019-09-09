const AdType = Object.freeze({
  BANNER: 0,
  NATIVE: 1,
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function constructNativeAdDiv(nativeAd, nativeAdDiv) {
  nativeAdDiv = nativeAdDiv.replace(new RegExp("##ICON_IMAGE##", 'g'), nativeAd.iconimage)
    .replace(/##TITLE##/g, nativeAd.title).replace(/##CLK##/g, nativeAd.clk).replace(/##TEXT##/g, nativeAd.text)
    .replace(/##CTA_TEXT##/g, nativeAd.ctatext).replace(/##MAIN_IMAGE##/g, nativeAd.mainimage);
  if (nativeAd.hasOwnProperty('imptracker')) {
    let spanDiv = document.createElement('div');
    let span = document.createElement('span');
    span.style.display = "none";
    for (let i = 0; i < nativeAd.imptracker.length; i++) {
      span.innerHTML += `<img src="${nativeAd.imptracker[i]}" height="1" width="1">`;
    }
    spanDiv.appendChild(span);
    nativeAdDiv += spanDiv.innerHTML;
  }
  return nativeAdDiv;
}

var MolocoSDK = function (data) {
  this.useEndpointV1 = data["use_endpoint_v1"] || false;
  this.useDirectLanding = data["use_direct_landing"] || false;
  this.endpoint = (!this.useEndpointV1) ? "//adservfnt-asia.adsmoloco.com/adserver?mobile_web=1" : "//adservfnt-asia.adsmoloco.com/adserver/v1?mobile_web=1";
  this.adUnit = data["ad_unit"];
  this.adType = data["ad_type"];
  this.containerId = data["container_id"];
  this.fallbackContainerId = data["fallback_container_id"];
  this.idfa = data["idfa"];
  this.bundle = data["bundle"];
  this.country = data["country_iso"];
  this.width = data["width"];
  this.height = data["height"];
  this.extra = encodeURIComponent(data["extra"] || "");
  this.os = data["os"] || "";
}

// Send ad request to Moloco.
MolocoSDK.prototype.requestAd = function (adDiv) {
  const orientation = window.innerWidth > window.innerHeight ? "l" : "p";
  let url = this.endpoint + "&id=" + this.adUnit + "&udid=ifa:" + this.idfa + "&bundle=" + this.bundle + "&iso=" + this.country + "&w=" + this.width + "&h=" + this.height + "&o=" + orientation + "&ufid=" + uuidv4() + "&x=" + this.extra + "&os=" + this.os;
  if (this.adType === AdType.NATIVE) {
    url = url + "&assets=title%2Ctext%2Ciconimage%2Cmainimage%2Cctatext";
  }

  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.send();

  const context = this;
  xhr.onreadystatechange = function () {
    if (context.adType === AdType.BANNER) {
      document.getElementById(context.containerId).style.display = "none";
      document.getElementById(context.fallbackContainerId).style.display = "block";
    } else {
      adDiv.style.display = "none";
    }
    if (this.readyState === 4 && this.status === 200) {
      switch (context.adType) {
        case AdType.BANNER:
          if (!context.useEndpointV1) {
              context.renderAd(xhr.responseText);
          } else {
              bannerAd = JSON.parse(xhr.responseText);
              if (context.useDirectLanding) {
                  context.renderAdWithRedirectUrl(bannerAd);
              } else {
                  context.renderAd(bannerAd.html);
              }
          }
          break;
        case AdType.NATIVE:
          let nativeAd;
          try {
            nativeAd = JSON.parse(xhr.responseText);
            adDiv.innerHTML = constructNativeAdDiv(nativeAd, adDiv.innerHTML);
            adDiv.style.display = "block";
          } catch (err) {
            console.log(err);
          }
          break;
      }
    }
  }
}

MolocoSDK.prototype.renderAdWithRedirectUrl = function (bannerAd) {
  this.renderAd(bannerAd.html);

  const atag = document.getElementById("molocoads_link");
  const originClickUrl = atag.href;
  atag.href = bannerAd.finallandingurl;

  if(atag.addEventListener) {
    atag.addEventListener('click', function(){
      let xhr = new XMLHttpRequest();
      xhr.open("GET", originClickUrl, true);
      xhr.send();
    });
  } else if(link.attachEvent) {
    atag.attachEvent('onclick', function(){
      let xhr = new XMLHttpRequest();
      xhr.open("GET", originClickUrl, true);
      xhr.send();
    });
  }
}

// Render ad received from Moloco.
MolocoSDK.prototype.renderAd = function (adm) {
  document.getElementById(this.fallbackContainerId).style.display = "block";
  document.getElementById(this.containerId).style.display = "none";
  this.replaceAdm(adm);
  document.getElementById(this.fallbackContainerId).style.display = "none";
  document.getElementById(this.containerId).style.display = "block";
}

// Refresh the ad slot by replacing the div content.
MolocoSDK.prototype.replaceAdm = function (adm) {
  var container = document.getElementById(this.containerId);
  container.innerHTML = adm;
  if (document.getElementById("__mimg")) {
    document.getElementById("__mimg").className = "content";
  }
}
