"use strict"

// runs when the page content is loaded
document.addEventListener('DOMContentLoaded', () => {
	const btnHave = document.getElementById('toggle-have'); // button for "Skills I Have"
	const btnNeed = document.getElementById('toggle-need'); // button for "Skills To Learn"
	const panelHave = document.getElementById('panel-have'); // panel for "Skills I Have"
	const panelNeed = document.getElementById('panel-need'); // panel for "Skills To Learn"

	const setActive = (type) => {
		if (type === 'have') {
			btnHave.classList.add('active');
			btnNeed.classList.remove('active');
			panelHave.classList.add('active');
			panelNeed.classList.remove('active');
		} else {
			btnHave.classList.remove('active');
			btnNeed.classList.add('active');
			panelHave.classList.remove('active');
			panelNeed.classList.add('active');
		}
	}

	btnHave.addEventListener('click', function (e) {
		e.preventDefault();
		setActive('have');
	});

	btnNeed.addEventListener('click', function (e) {
		e.preventDefault();
		setActive('need');
	});

	// Transform anchors inside the skills-sidebox into checkbox label items for each skill
	const dropdownContainers = document.querySelectorAll('.skills-sidebox .dropdown-links');
	dropdownContainers.forEach(function (container) {
		const anchors = Array.from(container.querySelectorAll('a.link'));
		anchors.forEach(function (a) {
			const text = a.textContent.trim();
			const label = document.createElement('label');
			label.className = 'skill-item';
			label.setAttribute('tabindex', '0');
			label.innerHTML = '<input type="checkbox" class="skill-checkbox" value="' + text + '"> <span class="skill-name">' + text + '</span>';
			a.replaceWith(label);
		});
	});

	// Add event listeners to the newly created skill items
	document.querySelectorAll('.skills-sidebox .skill-item').forEach(function (item) {
		const checkbox = item.querySelector('.skill-checkbox');
		const nameSpan = item.querySelector('.skill-name');
		item.addEventListener('click', function (e) {
			// allow checkbox default toggle; populate textbox with clicked skill
			const text = nameSpan.textContent.trim();
			const activePanel = document.querySelector('.skills-panel.active');
			const isHave = activePanel && activePanel.id === 'panel-have';
			const inputs = Array.from(document.querySelectorAll('.skill-dropdown-textbox'));
			const target = isHave ? inputs[0] : inputs[1];
			if (target) target.value = text;
		});

		checkbox.addEventListener('change', function () {
			item.classList.toggle('selected', checkbox.checked);
		});
	});
});

// Function for switching between tabs; is ran from HTML onclick() 
const tabFunctions = (tabName, event) => {
	let tabContents = document.getElementsByClassName("creation-tabs"); // Get a list of profile tabs
	let tabLinks = document.getElementsByClassName("tab-buttons");

	// Loop through each tab and set display to none; the targeted tab will be displayed after this loop
	for (let i = 0; i < tabContents.length; i++) {
		tabContents[i].style.display = "none";
	}

	for (let i = 0; i < tabLinks.length; i++) {
		tabLinks[i].className = tabLinks[i].className.replace(" active-tab", "");
	}

	document.getElementById(tabName).style.display = "block";
	event.currentTarget.className += " active-tab";
}