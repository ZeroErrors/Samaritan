// From Stack Overflow
// http://stackoverflow.com/questions/1582534/calculating-text-width-with-jquery
$.fn.textWidth = function() {
  var html_org = $(this).html();
  var html_calc = '<span>' + html_org + '</span>';
  $(this).html(html_calc);
  var width = $(this).find('span:first').width();
  $(this).html(html_org);
  return width;
};

_fnVar = function(fnVar) {
	if (typeof fnVar === "function") {
		return fnVar();
	}
	return fnVar;
}