var m = require('mithril');
var icon = require('../component/icon');
var animate = require('../lib/animate');
var withKey = require('../lib/withkey');

module.exports = {
	name: 'config',
	controller: Controller,
	view: view
};

function formatIngoreListItem(item) {
	return String(item).trim().replace(' ', '').toLowerCase();
}

function Controller() {
	var self = this;
	this.updateIgnoreList = function (list) {
		self.setter('cfg.ignoreList')(list.split('\n').map(formatIngoreListItem));
	};
}

function view(ctrl) {
	var i = 0;
	return [
		// active timeout
		m('article.option.active-timeout', {config: animate('slideinleft', 50 * i++)}, [
			m('label[for=cfg-active-timeout]', 'Active timeout'),
			m('input[type=range]#cfg-active-timeout', {
				min: 0,
				max: 60,
				oninput: m.withAttr('value', ctrl.setter('cfg.activeTimeout').type('number')),
				value: ctrl.cfg.activeTimeout
			}),
			m('span.meta', ctrl.cfg.activeTimeout
				? [ctrl.cfg.activeTimeout, ' ', m('em', 'min')]
				: [m('em', 'disabled')]
			),
			m('p.description', 'Time since last message, after which users are no longer considered active and removed from the list. Set to 0 to disable.')
		]),
		// uncheck winners
		m('article.option.uncheck-winners', {config: animate('slideinleft', 50 * i++)}, [
			m('label', {onmousedown: withKey(1, ctrl.setter('cfg.uncheckWinners').to(!ctrl.cfg.uncheckWinners))}, 'Uncheck winners'),
			icon(ctrl.cfg.uncheckWinners ? 'check' : 'close', {
				class: 'checkbox' + (ctrl.cfg.uncheckWinners ? ' checked' : ''),
				onmousedown: withKey(1, ctrl.setter('cfg.uncheckWinners').to(!ctrl.cfg.uncheckWinners))
			}),
			m('p.description', 'When enabled, winners are automatically unchecked to not win twice.')
		]),
		// keyword antispam
		m('article.option.keyword-antispam', {config: animate('slideinleft', 50 * i++)}, [
			m('label', {onmousedown: withKey(1, ctrl.setter('cfg.keywordAntispam').to(!ctrl.cfg.keywordAntispam))}, 'Keyword antispam'),
			icon(ctrl.cfg.keywordAntispam ? 'check' : 'close', {
				class: 'checkbox' + (ctrl.cfg.keywordAntispam ? ' checked' : ''),
				onmousedown: withKey(1, ctrl.setter('cfg.keywordAntispam').to(!ctrl.cfg.keywordAntispam))
			}),
			ctrl.cfg.keywordAntispam ? m('input[type=range]', {
				min: 1,
				max: 5,
				oninput: m.withAttr('value', ctrl.setter('cfg.keywordAntispamLimit').type('number')),
				value: ctrl.cfg.keywordAntispamLimit
			}) : null,
			ctrl.cfg.keywordAntispam ? m('span.meta', ctrl.cfg.keywordAntispamLimit) : null,
			m('p.description', 'People who enter keyword more than ' + howManyTimes(ctrl.cfg.keywordAntispamLimit) + ' are automatically unchecked.')
		]),
		// ignore list
		m('article.option.ignore-list', {config: animate('slideinleft', 50 * i++)}, [
			m('label[for=cfg-ignore-list]', [
				'Ignore list',
				m('p.description', 'Separate usernames with new lines.')
			]),
			m('textarea#cfg-ignore-list', {
				placeholder: 'enter names here',
				oninput: m.withAttr('value', ctrl.updateIgnoreList),
				value: ctrl.cfg.ignoreList.join('\n')
			})
		]),
		// display tooltips
		m('article.option.display-tooltips', {config: animate('slideinleft', 50 * i++)}, [
			m('label', {onmousedown: withKey(1, ctrl.setter('cfg.displayTooltips').to(!ctrl.cfg.displayTooltips))}, 'Display tooltips'),
			icon(ctrl.cfg.displayTooltips ? 'check' : 'close', {
				class: 'checkbox' + (ctrl.cfg.displayTooltips ? ' checked' : ''),
				onmousedown: withKey(1, ctrl.setter('cfg.displayTooltips').to(!ctrl.cfg.displayTooltips))
			}),
			m('p.description', 'Hide tooltips if you already know what is what.')
		])
	];
}

function howManyTimes(number) {
	number = number | 0;
	switch (number) {
		case 1: return 'once';
		case 2: return 'twice';
		default: return number + ' times';
	}
}