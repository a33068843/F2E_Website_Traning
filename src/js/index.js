// 首頁搜尋欄
const typeDropdown = $('#searchTypeDropdown');
const typeDropdownDefault = typeDropdown.find('.default .text')
const typeDropdownOptions = typeDropdown.find('.options li')
typeDropdown.on('click', function() {
  typeDropdown.toggleClass('active');
})
typeDropdownOptions.on('click', function() {
  const target = $(this).find('.text').text();
  typeDropdownDefault.text(target);
})
