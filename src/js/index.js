// 搜尋元件
function searchDropdown(dropdown) {
  const typeDropdownDefault = dropdown.find('.default .text')
  const typeDropdownOptions = dropdown.find('.options li')
  dropdown.on('click', function() {
    dropdown.toggleClass('active');
  })
  typeDropdownOptions.on('click', function() {
    const target = $(this).find('.text').text();
    typeDropdownDefault.text(target);
  })
}

$(document).ready(function() {
  // 搜尋元件判斷處
  const kindDropdown = $('#searchDropdown_kind');
  const hasKindDropdown = !!kindDropdown.length;
  if (hasKindDropdown) searchDropdown(kindDropdown);

  const cityDropdown = $('#searchDropdown_city');
  const hasCityDropdown = !!cityDropdown.length;
  if (hasCityDropdown) searchDropdown(cityDropdown);

  const topicDropdown = $('#searchDropdown_topic');
  const hasTopicDropdown = !!topicDropdown.length;
  if (hasTopicDropdown) searchDropdown(topicDropdown);

  // 滑動圖片
  if ($('#a').length) {
    $('#a').lightSlider({
      item: 1,
      loop:true,
      auto: false,
      addClass: 'customSlider',
      pauseOnHover: true,
      pause: 3000,
      slideMargin: 0
    });
  }
});
