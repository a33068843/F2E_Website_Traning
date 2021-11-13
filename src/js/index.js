// 下拉元件
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
function handleDropdown() {
  const kindDropdown = $('#searchDropdown_kind');
  const hasKindDropdown = !!kindDropdown.length;
  if (hasKindDropdown) searchDropdown(kindDropdown);

  const cityDropdown = $('#searchDropdown_city');
  const hasCityDropdown = !!cityDropdown.length;
  if (hasCityDropdown) searchDropdown(cityDropdown);

  const topicDropdown = $('#searchDropdown_topic');
  const hasTopicDropdown = !!topicDropdown.length;
  if (hasTopicDropdown) searchDropdown(topicDropdown);
}
function handleHomeItems() {
    const infoEvents = $('#recentEvent');
    infoEvents.on('click', '.card_detail', function() {
      const kindSetting = 'event';
      const citySetting = $(this).find('.locationWrapper .text').text();
      const topicSetting = null;
      const inputSetting = $(this).find('.title').text();
      const searchCondition = {
        "kindSetting": kindSetting,
        "citySetting": citySetting,
        "topicSetting": topicSetting,
        "inputSetting": inputSetting,
      }
      localStorage.setItem('setting', JSON.stringify(searchCondition))
      location.href = './information.html';
    });
    const infoFoods = $('#recentFood');
    infoFoods.on('click', '.card_simple', function() {
      const kindSetting = 'food';
      const citySetting = $(this).find('.locationWrapper .text').text();
      const topicSetting = null;
      const inputSetting = $(this).find('.title').text();
      const searchCondition = {
        "kindSetting": kindSetting,
        "citySetting": citySetting,
        "topicSetting": topicSetting,
        "inputSetting": inputSetting,
      }
      localStorage.setItem('setting', JSON.stringify(searchCondition))
      location.href = './information.html';
    });
    const infoScenes = $('#recentScene');
    infoScenes.on('click', '.card_simple', function() {
      const kindSetting = 'scene';
      const citySetting = $(this).find('.locationWrapper .text').text();
      const topicSetting = null;
      const inputSetting = $(this).find('.title').text();
      const searchCondition = {
        "kindSetting": kindSetting,
        "citySetting": citySetting,
        "topicSetting": topicSetting,
        "inputSetting": inputSetting,
      }
      localStorage.setItem('setting', JSON.stringify(searchCondition))
      location.href = './information.html';
    });
}
// 取得授權
function getAuthority() {
  const id = 'e7d52bd12c9d4392b114afddbde9e654'
  const key = 'x1kLGusSVGFE3vnaLUgiQYwGcfo'
  const GMTString = new Date().toGMTString();
  const ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(key, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  const HMAC = ShaObj.getHMAC('B64');
  const Authorization = 'hmac username=\"' + id + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return { 'Authorization': Authorization, 'X-Date': GMTString };
}
// 搜尋功能
const localSettings = JSON.parse(localStorage.getItem('setting'));
function search(localSettings, callApi) {
  const {
    kindSetting   = null,
    citySetting   = null,
    topicSetting  = null,
    inputSetting  = null,
  } = localSettings;

  switch(callApi) {
    case 'recentScene':
      recentScene();
      break;
    case 'recentEvent':
      recentEvent()
      break;
    case 'recentFood':
      recentFood();
      break;
    case 'searchScene':
      changeToSearch();
      searchScene(citySetting, topicSetting, inputSetting);
      break;
    case 'searchEvent':
      changeToSearch();
      searchEvent(citySetting, topicSetting, inputSetting);
      break;
    case 'searchFood':
      changeToSearch();
      searchFood(citySetting, topicSetting, inputSetting);
      break;
    case 'searchData':
      searchData(kindSetting, citySetting, topicSetting, inputSetting);
      break;
  }
}
// 將不同地方用到的 API 分出來

// 拿取位置資訊
function getPosition() {
  return new Promise((resolve, reject) => {
    return navigator.geolocation.getCurrentPosition(resolve, reject);
  })
}
// 最近活動
function recentEvent() {
  const selectDom = $('#recentEvent').find('.card_detailWrapper');
  const nowDate = new Date().toISOString().split('T')[0];
  const render = (data) => {
    const startDate = data.StartTime.split('T')[0].replaceAll('-','/');
    const endDate = data.EndTime.split('T')[0].replaceAll('-','/');
    return (`
      <div class="card_detail">
        <div class="img">
          <img src="${data.Picture.PictureUrl1 ? data.Picture.PictureUrl1 : "../images/noImage_x1.png"}">
        </div>
        <div class="description">
          <div class="dateWrapper">
            <span class="date_begin">${startDate}</span>
            <span class="date_dash"></span>
            <span class="date_finish">${endDate}</span>
          </div>
          <div class="title">${data.Name}</div>
          <div class="bottom_container">
            <div class="locationWrapper">
              <div class="icon"></div>
              <div class="text">${data.City}</div>
            </div>
            <div class="readMoreButton">
              <div class="text">詳細介紹</div><i class="fas fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>
    `)
  }
  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$filter=date(StartTime)%20ge%20${nowDate}&$orderby=StartTime%20asc&$top=4&$format=JSON`,
    { headers: getAuthority() }
  ).then((response) => {
    const datas = response.data;
    const item = datas.flatMap((data) => {
      return render(data);
    })
    selectDom.html(item);
  });
}
// 熱門打卡景點
function recentScene() {
  const selectDom = $('#recentScene').find('.card_simpleWrapper');
  const render = (data) => {
    return (`
      <div class="card_simple">
        <div class="img">
          <img src="${data.Picture.PictureUrl1 ? data.Picture.PictureUrl1 : "../images/noImage_x2.png"}">
        </div>
        <div class="title">${data.Name}</div>
        <div class="locationWrapper">
          <div class="icon"></div>
          <div class="text">${data.Address.substring(0,3)}</div>
        </div>
      </div>
    `)
  }
  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=4&$format=JSON`,
    { headers: getAuthority() }
  ).then((response) => {
    const datas = response.data;
    const item = datas.flatMap((data) => {
      return render(data);
    })
    selectDom.html(item);
  });
}
// 回訪美食
async function recentFood() {
  const selectDom = $('#recentFood').find('.card_simpleWrapper');
  const currentPostion = await getPosition()
    .then((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      return `&$spatialFilter=nearby(${latitude}, ${longitude}, 1000)`;
    })
    .catch((err) => {
      return ``;
    })
  ;
  const render = (data) => {
    return (`
      <div class="card_simple">
        <div class="img">
          <img src="${data.Picture.PictureUrl1 ? data.Picture.PictureUrl1 : "../images/noImage_x2.png"}">
        </div>
        <div class="title">${data.Name}</div>
        <div class="locationWrapper">
          <div class="icon"></div>
          <div class="text">${data.Address.substring(0,3)}</div>
        </div>
      </div>
    `)
  }
  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$top=4${currentPostion}&$format=JSON`,
    { headers: getAuthority() }
  ).then((response) => {
    const datas = response.data;
    const item = datas.flatMap((data) => {
      return render(data);
    })
    selectDom.html(item);
  });
}

function changeToSearch() {
  const searchContainer = $('#searchContainer');
  if (!!$('.card_imgWrapper').length) {
    const selectDom = searchContainer.find('.card_imgWrapper');
    selectDom.removeClass('card_imgWrapper').addClass('card_simpleWrapper')
    selectDom.html(``);
  }
  searchContainer.addClass('resultPage');
}
// 搜尋景點
function searchScene(citySetting, topicSetting, inputSetting) {
  const isCityNull = !citySetting || citySetting === '全部縣市';
  const city = isCityNull ? `` : ` and contains(Address, '${citySetting}')`;
  const isTopicNull = !topicSetting || topicSetting === '全部主題';
  const topic = isTopicNull ? `` : ` and (Class1 eq '${topicSetting}' or Class2 eq '${topicSetting}' or Class3 eq '${topicSetting}')`;
  const isInputNull = inputSetting === null;
  const input = isInputNull ? `` : `${inputSetting}`;

  const searchCity = $('#searchDropdown_city').find('.default .text');
  if (!isCityNull) searchCity.text(citySetting);
  const searchTopic = $('#searchDropdown_topic').find('.default .text');
  if (!isTopicNull) searchTopic.text(topicSetting);
  const searchScene = $('#searchContainer');
  const searchEmpty = $('#searchEmpty');
  const pagination = $('#pagination');
  const topResult = searchScene.find('.topWrapper');
  const selectDom = searchScene.find('.card_simpleWrapper');
  const renderTop = (count) => {
    return (`
      <div class="title">搜尋結果</div>
      <div class="text">共有 <span class="resultCount">${count}</span> 筆</div>
    `)
  }
  const render = (data) => {
    const address = data.Address ? data.Address.substring(0,3) : '查無資料';
    return (`
      <div class="card_simple">
        <div class="img">
          <img src="${data.Picture.PictureUrl1 ? data.Picture.PictureUrl1 : "../images/noImage_x2.png"}">
        </div>
        <div class="title">${data.Name}</div>
        <div class="locationWrapper">
          <div class="icon"></div>
          <div class="text">${address}</div>
        </div>
      </div>
    `)
  }
  const renderPage = (pagination) => {
    pagination.find('a').addClass('paginationButton');
    pagination.find('.paginationjs-prev > a').html(`<i class="fas fa-chevron-left"></i>`);
    pagination.find('.paginationjs-next > a').html(`<i class="fas fa-chevron-right"></i>`);
  }
  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?
    $filter=contains(Name, '${input}')${city}${topic}&$format=JSON`,
    { headers: getAuthority() }
  ).then((response) => {
    const datas = response.data;
    topResult.html(renderTop(datas.length));
    if (!datas.length) {
      if (pagination.is(':visible')) pagination.toggle();
      if (!searchEmpty.is(':visible')) searchEmpty.toggle();
    }
    else {
      if (!pagination.is(':visible')) pagination.toggle();
      if (searchEmpty.is(':visible')) searchEmpty.toggle();
    }
    pagination.pagination({
      dataSource: datas,
      pageSize: 20,
      callback: function(datas, pagination) {
        
        renderPage(pagination.el);
        const item = datas.flatMap((data) => {
          return render(data);
        })
        selectDom.html(item);
        $('html').animate({ scrollTop: 220 }, 'normal');
      }
    })
  });
}
// 搜尋活動
function searchEvent(citySetting, topicSetting, inputSetting) {
  const isCityNull = !citySetting || citySetting === '全部縣市';
  const city = isCityNull ? `` : ` and contains(Address, '${citySetting}')`;
  const isTopicNull = !topicSetting || topicSetting === '全部主題';
  const topic = isTopicNull ? `` : ` and (Class1 eq '${topicSetting}' or Class2 eq '${topicSetting}')`;
  const isInputNull = inputSetting === null;
  const input = isInputNull ? `` : `${inputSetting}`;

  const searchCity = $('#searchDropdown_city').find('.default .text');
  if (!isCityNull) searchCity.text(citySetting);
  const searchTopic = $('#searchDropdown_topic').find('.default .text');
  if (!isTopicNull) searchTopic.text(topicSetting);
  const searchEvent = $('#searchContainer');
  const searchEmpty = $('#searchEmpty');
  const pagination = $('#pagination');
  const topResult = searchEvent.find('.topWrapper');
  const selectDom = searchEvent.find('.card_simpleWrapper');
  const renderTop = (count) => {
    return (`
      <div class="title">搜尋結果</div>
      <div class="text">共有 <span class="resultCount">${count}</span> 筆</div>
    `)
  }
  const render = (data) => {
    const address = data.Address ? data.Address.substring(0,3) : '查無資料';
    return (`
      <div class="card_simple">
        <div class="img">
          <img src="${data.Picture.PictureUrl1 ? data.Picture.PictureUrl1 : "../images/noImage_x2.png"}">
        </div>
        <div class="title">${data.Name}</div>
        <div class="locationWrapper">
          <div class="icon"></div>
          <div class="text">${address}</div>
        </div>
      </div>
    `)
  }
  const renderPage = (pagination) => {
    pagination.find('a').addClass('paginationButton');
    pagination.find('.paginationjs-prev > a').html(`<i class="fas fa-chevron-left"></i>`);
    pagination.find('.paginationjs-next > a').html(`<i class="fas fa-chevron-right"></i>`);
  }
  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?
    $filter=contains(Name, '${input}')${city}${topic}&$format=JSON`,
    { headers: getAuthority() }
  ).then((response) => {
    const datas = response.data;
    topResult.html(renderTop(datas.length));
    if (!datas.length) {
      if (pagination.is(':visible')) pagination.toggle();
      if (!searchEmpty.is(':visible')) searchEmpty.toggle();
    }
    else {
      if (!pagination.is(':visible')) pagination.toggle();
      if (searchEmpty.is(':visible')) searchEmpty.toggle();
    }
    pagination.pagination({
      dataSource: datas,
      pageSize: 20,
      callback: function(datas, pagination) {
        
        renderPage(pagination.el);
        const item = datas.flatMap((data) => {
          return render(data);
        })
        selectDom.html(item);
        $('html').animate({ scrollTop: 220 }, 'normal');
      }
    })
  });
}
// 搜尋美食
function searchFood(citySetting, topicSetting, inputSetting) {
  const isCityNull = !citySetting || citySetting === '全部縣市';
  const city = isCityNull ? `` : ` and contains(City, '${citySetting}')`;
  const isTopicNull = !topicSetting || topicSetting === '全部分類';
  const topic = isTopicNull ? `` : ` and (Class eq '${topicSetting}')`;
  const isInputNull = inputSetting === null;
  const input = isInputNull ? `` : `${inputSetting}`;

  const searchCity = $('#searchDropdown_city').find('.default .text');
  if (!isCityNull) searchCity.text(citySetting);
  const searchTopic = $('#searchDropdown_topic').find('.default .text');
  if (!isTopicNull) searchTopic.text(topicSetting);
  const searchFood = $('#searchContainer');
  const searchEmpty = $('#searchEmpty');
  const pagination = $('#pagination');
  const topResult = searchFood.find('.topWrapper');
  const selectDom = searchFood.find('.card_simpleWrapper');
  const renderTop = (count) => {
    return (`
      <div class="title">搜尋結果</div>
      <div class="text">共有 <span class="resultCount">${count}</span> 筆</div>
    `)
  }
  const render = (data) => {
    const address = data.Address ? data.Address.substring(0,3) : '查無資料';
    return (`
      <div class="card_simple">
        <div class="img">
          <img src="${data.Picture.PictureUrl1 ? data.Picture.PictureUrl1 : "../images/noImage_x2.png"}">
        </div>
        <div class="title">${data.Name}</div>
        <div class="locationWrapper">
          <div class="icon"></div>
          <div class="text">${!!data.City ? data.City : address}</div>
        </div>
      </div>
    `)
  }
  const renderPage = (pagination) => {
    pagination.find('a').addClass('paginationButton');
    pagination.find('.paginationjs-prev > a').html(`<i class="fas fa-chevron-left"></i>`);
    pagination.find('.paginationjs-next > a').html(`<i class="fas fa-chevron-right"></i>`);
  }
  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?
    $filter=contains(Name, '${input}')${city}${topic}&$format=JSON`,
    { headers: getAuthority() }
  ).then((response) => {
    const datas = response.data;
    topResult.html(renderTop(datas.length));
    if (!datas.length) {
      if (pagination.is(':visible')) pagination.toggle();
      if (!searchEmpty.is(':visible')) searchEmpty.toggle();
    }
    else {
      if (!pagination.is(':visible')) pagination.toggle();
      if (searchEmpty.is(':visible')) searchEmpty.toggle();
    }
    pagination.pagination({
      dataSource: datas,
      pageSize: 20,
      callback: function(datas, pagination) {
        
        renderPage(pagination.el);
        const item = datas.flatMap((data) => {
          return render(data);
        })
        selectDom.html(item);
        $('html').animate({ scrollTop: 220 }, 'normal');
      }
    })
  });
}
function searchData(kindSetting, citySetting, topicSetting, inputSetting) {

}

// 搜索頁面分頁
function searchResult() {
  const selectDom = $('#checkResults').find('.card_simpleWrapper');
  const pagination = $('#pagination');
  const render = (data) => {
    return (`
      <div class="card_simple">
        <div class="img">
          <img src="${data.Picture.PictureUrl1 ? data.Picture.PictureUrl1 : "../images/noImage_x2.png"}">
        </div>
        <div class="title">${data.Name}</div>
        <div class="locationWrapper">
          <div class="icon"></div>
          <div class="text">${data.Address.substring(0,3)}</div>
        </div>
      </div>
    `)
  }
  const renderPage = (pagination) => {
    pagination.find('a').addClass('paginationButton');
    pagination.find('.paginationjs-prev > a').html(`<i class="fas fa-chevron-left"></i>`);
    pagination.find('.paginationjs-next > a').html(`<i class="fas fa-chevron-right"></i>`);
  }
  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=22&$format=JSON`,
    { headers: getAuthority() }
  ).then((response) => {
    const datas = response.data;
    pagination.pagination({
      dataSource: datas,
      pageSize: 20,
      callback: function(datas, pagination) {
        
        renderPage(pagination.el);
        const item = datas.flatMap((data) => {
          return render(data);
        })
        selectDom.html(item);
      }
    })
  });
}

$(document).ready(function() {
  const currentPage = location.pathname;
  const localSettings = JSON.parse(localStorage.getItem('setting'));
  const isFromHome = localStorage.getItem('search');
  localStorage.clear();
  console.log(localSettings)

  // 下拉元件
  handleDropdown();

  // 從首頁跳轉過來先判斷有沒有輸入關鍵字
  if (isFromHome) {
    if (!localSettings.inputSetting) return;
    $('#search_keyword').val(localSettings.inputSetting);
    if (currentPage === '/scene.html') search(localSettings, 'searchScene');
    if (currentPage === '/event.html') search(localSettings, 'searchEvent');
    if (currentPage === '/food.html') search(localSettings, 'searchFood');
  }
  // 首頁串 API
  if (currentPage === '/') {
    const searchCondition = {};
    search(searchCondition, 'recentEvent');
    search(searchCondition, 'recentScene');
    search(searchCondition, 'recentFood');
    // 首頁連結資訊
    handleHomeItems()
  }
  if (currentPage === '/information.html') {

  }
  // 判斷是否點擊熱門主題區
  const imgCards = $('.card_imgWrapper').find('.card_img');
  imgCards.on('click', function() {
    const topicSetting = $(this).find('.title').text();
    const searchCondition = {
      "citySetting": '全部縣市',
      "topicSetting": topicSetting,
    };
    switch (currentPage) {
      case '/scene.html':
        search(searchCondition, 'searchScene');
        break;
      case '/event.html':
        search(searchCondition, 'searchEvent');
        break;
      case '/food.html':
        search(searchCondition, 'searchFood');
        break;
    }
  })
  // 搜尋按鈕
  const searchButton = $('.searchButton');
  searchButton.on('click', function() {
    const kindSetting = $('.breadcrumbs').length ?
      $('.breadcrumbs li').last().text() : $('#searchDropdown_kind').find('.default .text').text();
    const citySetting = $('#searchDropdown_city').find('.default .text').text()
    const topicSetting = $('#searchDropdown_topic').find('.default .text').text()
    const inputSetting = $('#search_keyword').val();
    const searchCondition = {
      "kindSetting": kindSetting,
      "citySetting": citySetting,
      "topicSetting": topicSetting,
      "inputSetting": inputSetting,
    }
    localStorage.setItem('setting', JSON.stringify(searchCondition))

    // 處理首頁時候的搜尋按鈕
    if (currentPage === '/') {
      localStorage.setItem('search', true);
      switch(searchCondition.kindSetting) {
        case '探索景點':
          location.href = './scene.html';
          break;
        case '節慶活動':
          location.href = './event.html';
          break;
        case '品嘗美食':
          location.href = './food.html';
          break;
      }
      return;
    }
    if (currentPage === '/scene.html') {
      search(searchCondition, 'searchScene');
      return;
    }
    if (currentPage === '/event.html') {
      search(searchCondition, 'searchEvent');
      return;
    }
    if (currentPage === '/food.html') {
      search(searchCondition, 'searchFood');
      return;
    }
  });

  
  // 滑動圖片
  if ($('#a').length) {
    $('#a').lightSlider({
      item: 1,
      loop:true,
      auto: false,
      addClass: 'customSlider',
      pauseOnHover: true,
      pause: 3000,
      slideMargin: 0,
      enableDrag: false,
    });
  }
});
