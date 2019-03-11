var loanWindowOpened = false;
var wnd = null;
var i = 0;  

buildLoanChangeGrid = (loan) => {
  let html = `<!doctype html>
  <title>Example Plugin</title>
  <style>
    .wrapper {
      background-color: rgba(0, 180, 255,0.75);
      list-style-type: none;
      padding: 0;
      border-radius: 3px;
    }
    .form-row {
      display: flex;
      justify-content: flex-end;
      padding: .5em;
    }
    .header {
      text-align: center;
    }
    .table-body {
      background-color: white;
    }
    .table-body > label {
      border-style: solid;
      border-width: 1px;
    }
    .form-row > label {
      padding: .5em 0 .5em 0;
      text-align: center;
      flex: 1;
    }
    .form-row > input {
      padding: .5em 0 .5em 0;
      flex: 1;
    }
    .form-row > input,
    .form-row > button {
      padding: .5em;
    }
    .form-row > button {
     background: MediumSeaGreen;
     color: white;
     height: 3em;
     width: 8em;
     border: 0;
    }
  </style>
  <script>
    mergeNewValue = () => {
      //Get all rows and filter for only those with values in "changeVal"
      let matches = [].slice.call(document.querySelectorAll('[id^=changeVal-]'));
      let changedFields = matches.filter(field => field.value && field.value != '');

      let loanData = [];
      changedFields.forEach(field => {
        let i = field.id.substr(field.id.indexOf('-')+1);
        let fieldId =  document.getElementById('fieldId-'+i).innerHTML;
        loanData.push({'fieldId' : fieldId, 'changeVal': field.value});
      });
      let msg = {
        'message': 'merge',
        'loanData': loanData
      };
      if (loanData.length > 0) {
        window.opener.postMessage(msg, '*'); 
      }
      //window.close();
    }
  </script>
  <div>
    <ul class="wrapper">
      <li class="form-row header">
        <label>Field Id</label>
        <label>Previous Value</label>
        <label>New Value</label>
        <label>Update To Value</label>
      </li>
      <li id="mergeButton" class="form-row">
        <button onclick="mergeNewValue()">Merge</button>
      </li>
    </ul>
  </div>`;

  return html;
}

buildRow = (loan) => {
  i++;
  let row = `<li class="form-row table-body">
        <label id="fieldId-${i}">${loan.fieldID}</label>
        <label>${loan.oldVal}</label>
        <label>${loan.newVal}</label>
        <input type="text" id="changeVal-${i}">
      </li>`;
  return row;
}

openLoanChangeWindow = (loanData) => {
  let html = buildLoanChangeGrid(loanData);

  const w = 600, h = 400;
  const left = (screen.width/2)-(w/2), top = (screen.height/2)-(h/2);
  const wndOpts = 'scrollbars=yes,resizable=no,width='+w+',height='+h+',top='+top+',left='+left;

  window.addEventListener('message', () => {
      switch (event.data.message) {
        case 'merge':
          this.executeMerge(event.data);
        break;
      }
  });
  if(!wnd || wnd.closed) {
    wnd = window.open('/', 'wnd', wndOpts);
    wnd.document.write(html);
    wnd.document.getElementById('mergeButton').insertAdjacentHTML('beforebegin',buildRow(loanData));
  } else {
    wnd.document.getElementById('mergeButton').insertAdjacentHTML('beforebegin',buildRow(loanData));
  }
}

//Capture change event
loanChangeEvent = (obj, data) => {
  //data - oldVal, newVal, fieldId
  if(data.fieldID && data.newVal) {
    console.log('Plugin sample: Loan change event fired: ', obj, data);
    openLoanChangeWindow(data);
  }
}

//execute merge 
executeMerge = (data) => {
  console.log("Plugin sample: merge called for: " + JSON.stringify(data.loanData));
  let fields = {};
  data.loanData.forEach(item => {
    fields[item.fieldId] = item.changeVal;
  })
  elli.script.getObject('loan').then((loanObj) => {
    loanObj.setFields(fields);
    //Used to sync the object and re-bind the UI fields
    loanObj.merge();
  });
}


//Subscribe to events
// CHeck if elli and elli.script exists before kicking off the 
// process to create the guest and get data from Host
if (elli && elli.script) {
    // loanChangeEvent will be fired everytime you call setField function
    elli.script.subscribe('loan', 'change', loanChangeEvent);
}

