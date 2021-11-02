import QRCodeStyling, {
    DrawType,
    TypeNumber,
    Mode,
    ErrorCorrectionLevel,
    DotType,
    CornerSquareType,
    CornerDotType
} from 'qr-code-styling';

function setValues()
{
  var uri = window.location.href;
  var queryString = uri.split("?");
  var parameters = queryString[1].split("&");

  for (var i = 0; i < parameters.length; i++)
  {
    var parameter = parameters[i].split("=");
    var key = parameter[0];
    var value = parameter[1];
    
    if (key === "background") {

      var body = document.querySelector("body");
      if(body instanceof HTMLElement)
      {
        body.style.backgroundImage = `url(https://source.unsplash.com/${decodeURI(value)}/1000×1000/?blur)`;
      }
      continue;
    }

    if (key === "avatar") {
      var avatar = document.getElementById("avatar");
      if(avatar instanceof HTMLImageElement)
      {
        if (value.startsWith('http')) {
          avatar.src = decodeURI(value);
        }
        else {
          avatar.src = `https://source.unsplash.com/${decodeURI(value)}/100*100/?face`;
        }
        if(avatar.parentElement)
        {
          avatar.parentElement.style.display = 'block';
        }
      }
      continue;
    }

    var element = document.getElementById(key);
    
    if (element)
    {
      element.innerText = decodeURI(parameter[1]);
      if(element.parentElement)
      {
        element.parentElement.style.display = 'flex';
      }
    }
    else
    {
      var e = document.querySelector(`[data-${key}]`);
      if(e instanceof HTMLElement)
      {
        e.dataset[key] = decodeURI(value);
      }
    }
  }
}

setValues();

var qrElement = document.getElementById('qr');

const options = {
    width: 600,
    height: 600,
    type: 'canvas' as DrawType,
    data: window.location.href,
    image: '',
    margin: 10,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: 'L' as ErrorCorrectionLevel
    },
    dotsOptions: {
      color: '#000000',
      type: 'rounded' as DotType
    },
    backgroundOptions: {
      color: '#ffffffaa',
    },
    cornersSquareOptions: {
      color: '#000000',
      type: 'extra-rounded' as CornerSquareType,
    },
    cornersDotOptions: {
      color: '#000000',
      type: 'dot' as CornerDotType,
    }
  };
 
const qrCode = new QRCodeStyling(options);

window.addEventListener("load",  () => {
  var content = document.querySelector('body > .content');
  if (content instanceof HTMLElement) {
    content.style.visibility = "visible";
  }
  
  if(qrElement){
    qrCode.append(qrElement);
  }
});