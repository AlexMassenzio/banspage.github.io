let currentBucketIndex = 2;
function addStage(ind) {
	let bucket = document.getElementById("bucket" + ind.toString());
	let div = bucket.getElementsByTagName("div")[0];

	let newSelect = document.createElement("SELECT");
	newSelect.innerHTML = getSelectInner();
	div.appendChild(newSelect);
	div.appendChild(document.createElement("br"));
}

function removeStage(ind) {
	let bucket = document.getElementById("bucket" + ind.toString());
	let div = bucket.getElementsByTagName("div")[0];
	if (div.getElementsByTagName("SELECT").length <= 1 && ind > 2) {
		bucket.remove();
		if (ind == currentBucketIndex) {
			currentBucketIndex -= 1;
		}
		setFirstBucketHeaders();
		return;
	} else if (div.getElementsByTagName("SELECT").length <= 1) {
		return;
	}

	while (div.lastChild.tagName != "SELECT") {
		div.removeChild(div.lastChild);
	}
	div.removeChild(div.lastChild);
}

function addBucket() {
	currentBucketIndex += 1;
	let main = document.getElementById("buckets");
	let newSection = document.createElement("SECTION");
	newSection.id = "bucket" + currentBucketIndex.toString();

	let htmlString = "<h2>Bucket " + currentBucketIndex.toString() + "</h2>\n";
	htmlString += "<button onclick=\"addStage(" + currentBucketIndex.toString() + ")\">+</button>\n<button onclick=\"removeStage(" + currentBucketIndex.toString() + ")\">-</button><br /><br />\n";
	htmlString += "<div>\n<select>" + getSelectInner() + "</select><br />\n</div>";
	newSection.innerHTML = htmlString;

	main.appendChild(newSection);
	setFirstBucketHeaders();
}

function getSelectInner() {
	let htmlString = "<option value=\"\">None</option>\n";
	for (let i = 0; i < whitelist.length; i++) {
		let realID = names.indexOf(whitelist[i]);
		htmlString += "<option value=\"" + realID.toString() + "\">" + whitelist[i] + "</option>\n";
		htmlString += "<option value=\"" + realID.toString() + "h\">" + whitelist[i] + " ¬</option>\n";
	}
	return htmlString;
}

function loadSelects() {
	let selects = document.getElementsByTagName("select");
	for (let i = 0; i < selects.length; i++) {
		selects[i].innerHTML = getSelectInner();
	}
	document.getElementById("generatedCode").value = "";
}

function setFirstBucketHeaders() {
	if (document.getElementById("buckets").getElementsByTagName("section").length == 2) {
		document.getElementById("header1").innerHTML = "Starters";
		document.getElementById("header2").innerHTML = "Counterpicks";
	} else {
		document.getElementById("header1").innerHTML = "Bucket 1";
		document.getElementById("header2").innerHTML = "Bucket 2";
	}
}

function generateCode() {
	let main = document.getElementById("buckets");
	let sections = main.getElementsByTagName("section");

	let resultString = "";
	for (let i = 0; i < sections.length; i++) {
		let bucketString = "";
		if (i != 0) {
			bucketString += "|";
		}
		
		let selects = sections[i].getElementsByTagName("div")[0].getElementsByTagName("select");

		for (let j = 0; j < selects.length; j++) {
			if (j != 0) {
				bucketString += "-";
			}
			bucketString += selects[j].value;
		}
		if (bucketString.length > 0 && bucketString != "|")
			resultString += bucketString;
	}
	console.log(resultString);

	document.getElementById("generatedCode").value = resultString;

	return resultString;
}

function loadBuckets() {
	let code = document.getElementById("generatedCode").value;
	let bucketCodes = code.split("|");
	if (bucketCodes.length == 0)
		return;

	let main = document.getElementById("buckets");

	while (main.getElementsByTagName("section").length > 2) {
		main.removeChild(main.lastChild);
	}
	currentBucketIndex = 2;


	while (main.getElementsByTagName("section").length < bucketCodes.length) {
		addBucket();
	}

	for (let i = 0; i < bucketCodes.length; i++) {
		let stages = bucketCodes[i].split("-");
		let currentBucket = document.getElementById("bucket" + (i + 1).toString()).getElementsByTagName("div")[0];
		while (currentBucket.getElementsByTagName("select").length < stages.length)
			addStage(i + 1);
		let selects = currentBucket.getElementsByTagName("select");
		for (let j = 0; j < stages.length; j++) {
			selects[j].value = stages[j]
		}
	}

	document.getElementById("generatedCode").value = "";
}

function redirect() {
	let v = document.getElementById("generatedCode").value;

	if (!v) {
		generateCode();
		v = document.getElementById("generatedCode").value;
	}

	if (v)
		window.location.href = "../index.html?s=" + v;
}