document.addEventListener('DOMContentLoaded', function () {
	const btnHave = document.getElementById('toggle-have');
	const btnNeed = document.getElementById('toggle-need');
	const panelHave = document.getElementById('panel-have');
	const panelNeed = document.getElementById('panel-need');

	function setActive(type) {
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

	btnHave && btnHave.addEventListener('click', function (e) {
		e.preventDefault();
		setActive('have');
	});

	btnNeed && btnNeed.addEventListener('click', function (e) {
		e.preventDefault();
		setActive('need');
	});

	// Optional: clicking a skill link will populate the corresponding textbox
	document.querySelectorAll('.skills-sidebox .dropdown-links .link').forEach(function (link) {
		link.addEventListener('click', function (e) {
			e.preventDefault();
			const text = this.textContent.trim();
			const activePanel = document.querySelector('.skills-panel.active');
			const isHave = activePanel && activePanel.id === 'panel-have';
			// There are two inputs with class .skill-dropdown-textbox in the form: first = Have, second = Need
			const inputs = Array.from(document.querySelectorAll('.skill-dropdown-textbox'));
			const target = isHave ? inputs[0] : inputs[1];
			if (target) target.value = text;
		});
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
