# exp19-custom-plugins
This repo contains 2 examples of cutom plugins that are tied to different events.

:information_source:
_In the current examples I'm using the promise syntax as opposed to the async/await syntax, but either can be used._

## Loan Change Audit
This plugin demonstrates how you can create a plugin to control the flow of a loan when the loan object is changed.  In this case everytime an LO edits a field on a form, standard, custom or otherwise; the plugin captures that change and displays it in a popup as an audit log giving the ability to change the data. 

**Key Concepts**
- Subscribe to loan change events
	```
	elli.script.subscribe('loan', 'change', <MyEventHandler>);
	```
- Accessing objects from the scripting framework
	```
	elli.script.getObject('loan').then((loanObj) => { //do something with loanObj here });
	```
- Applying changes to a loan object via the scripting framework
	```
	all()
	getField("<fieldId>")
	setFields(<fieldMap>)
	merge()
	isReadOnly()
	calculate()
	```


## Login Welcome Message
This plugin demonstrates how you can create a plugin to execute a custom flow during the login process.  In this case when the LO logs in the plugin is making a call to a service to get a list of hot items that they should be focusing on for the day.  These hot items are then dispalyed via a popup for the LO to see.

**Key Concepts**
- Subscribe to application login event
	```
	elli.script.subscribe('application', 'login', <MyEventHandler>);
	```
- Accessing objects from the scirpting framework
	```
	elli.script.getObject("http").then((myHttpObj) => { //do something with myHttpObj here });
	```
- Using the HTTP object for making external calls via the scripting framework
	```
	get("<url>", <headerObjOrAccessToken>)
	post("<url>", <contentObj>, <headerObjOrAccessToken>)
	patch("<url>", <contentObj>, <headerObjOrAccessToken>)
	put("<url>", <contentObj>, <headerObjOrAccessToken>)
	delete("<url>", <headerObjOrAccessToken>)
	```



