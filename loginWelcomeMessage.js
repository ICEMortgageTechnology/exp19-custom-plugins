var loanWindowOpened = false;
var wnd = null;

buildWelcomeContainer = (loan) => {
  let html = `<!DOCTYPE html>
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
    body {
      margin: 0;
      min-width: 250px;
    }

    /* Include the padding and border in an element's total width and height */
    * {
      box-sizing: border-box;
    }

    /* Remove margins and padding from the list */
    ul {
      margin: 0;
      padding: 0;
    }

    /* Style the list items */
    ul li {
      position: relative;
      padding: 12px 8px 12px 40px;
      list-style-type: none;
      background: #eee;
      font-size: 18px;
    }

    /* Set all odd list items to a different color (zebra-stripes) */
    ul li:nth-child(odd) {
      background: #f9f9f9;
    }

    /* Style the header */
    .header {
      background-color: rgba(0, 180, 255,0.75);
      padding: 30px 40px;
      color: white;
      text-align: center;
    }

    /* Style the header */
    .header .subheader {
      color: black;
      text-align: center;
      margin: 5px;
      border: none;
      border-radius: 0;
      width: 75%;
      padding: 10px;
      float: center;
      font-size: 20px;
    }

    /* Clear floats after the header */
    .header:after {
      content: "";
      display: table;
      clear: both;
    }
    </style>
    </head>
    <body>

    <div id="myDIV" class="header">
      <h2 style="margin:5px">Welcome!</h2>
      <span class="subheader">Here's the hot items for today.</span>
    </div>

    <ul id="myUL">
    </ul>
    </body>
    </html>`;

  return html;
}

addHotItem = (hotItems) => {
  let rows = '';
  hotItems.forEach((item) => {
    rows += `<li>${item}</li>`;
  });
  return rows;
}

openWelcomeWindow = (hotItems) => {
  let html = buildWelcomeContainer();

  const w = 600, h = 400;
  const left = (screen.width/2)-(w/2), top = (screen.height/2)-(h/2);
  const wndOpts = 'scrollbars=yes,resizable=no,width='+w+',height='+h+',top='+top+',left='+left;

  wnd = window.open('/', 'wnd', wndOpts);
  wnd.document.write(html);
  wnd.document.getElementById('myUL').insertAdjacentHTML('beforeend',addHotItem(hotItems));
}


//Capture login completed event
loginFinishedEvent = () => {
  console.log('Plugin sample: onLogin event fired');
  //Get list of daily hot items
  let hotItems = [];
  elli.script.getObject("http").then((myHttpObj) => {
    myHttpObj.get('https://ec2-18-237-92-117.us-west-2.compute.amazonaws.com/hotItems').then((resp) => {
        hotItems = resp.body;
        //Launch Window with hot items
        openWelcomeWindow(hotItems);
    });
  });
}


//Subscribe to events
// CHeck if elli and elli.script exists before kicking off the 
// process to create the guest and get data from Host
if (elli && elli.script) {
    // subscribe to login event 
    elli.script.subscribe('application', 'login', loginFinishedEvent);
}

