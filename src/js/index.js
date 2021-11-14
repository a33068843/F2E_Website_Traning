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
    const kindSetting = 'Activity';
    const citySetting = $(this).find('.locationWrapper .text').text();
    const topicSetting = null;
    const inputSetting = $(this).find('.title').text();
    const searchCondition = {
      "kindSetting": kindSetting,
      "citySetting": citySetting,
      "topicSetting": topicSetting,
      "inputSetting": inputSetting,
    }
    sessionStorage.setItem('setting', JSON.stringify(searchCondition))
    location.href = './information.html';
  });
  const infoFoods = $('#recentFood');
  infoFoods.on('click', '.card_simple', function() {
    const kindSetting = 'Restaurant';
    const citySetting = $(this).find('.locationWrapper .text').text();
    const topicSetting = null;
    const inputSetting = $(this).find('.title').text();
    const searchCondition = {
      "kindSetting": kindSetting,
      "citySetting": citySetting,
      "topicSetting": topicSetting,
      "inputSetting": inputSetting,
    }
    sessionStorage.setItem('setting', JSON.stringify(searchCondition));
    location.href = "./information.html";
  });
  const infoScenes = $('#recentScene');
  infoScenes.on('click', '.card_simple', function() {
    const kindSetting = 'ScenicSpot';
    const citySetting = $(this).find('.locationWrapper .text').text();
    const topicSetting = null;
    const inputSetting = $(this).find('.title').text();
    const searchCondition = {
      "kindSetting": kindSetting,
      "citySetting": citySetting,
      "topicSetting": topicSetting,
      "inputSetting": inputSetting,
    }
    sessionStorage.setItem('setting', JSON.stringify(searchCondition))
    location.href = './information.html';
  });
}
function randomItem() {
  return Math.floor(Math.random() * 100) + 1;
}
function handleError(image) {
  image.src = '../images/noImage_x2.png'
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
function search(sessionSettings, callApi) {
  const {
    kindSetting     = null,
    citySetting     = null,
    topicSetting    = null,
    inputSetting    = null,
  } = sessionSettings;

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
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?
    $top=4&$skip=${randomItem()}&$format=JSON`,
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
  const currentPosition = ``;
  // 同步會有問題、故註解保留
  // const currentPosition = await getPosition()
  //   .then((position) => {
  //     const latitude = position.coords.latitude;
  //     const longitude = position.coords.longitude;
  //     return `&$spatialFilter=nearby(${latitude}, ${longitude}, 10000)`;
  //   })
  //   .catch((err) => {
  //     return ``;
  //   })
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
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?
    $top=4${currentPosition}&$skip=${randomItem()}&$format=JSON`,
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
          <img onerror="handleError(this)" src="${data.Picture.PictureUrl1 ? data.Picture.PictureUrl1 : "../images/noImage_x2.png"}">
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
  })
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
  const isKindNull = !kindSetting || kindSetting === null;
  const kind = isKindNull ? `` : `${kindSetting}`;
  const isCityNull = !citySetting || citySetting === '全部縣市';
  const city = isCityNull ? `` : ` and contains(Address, '${citySetting}')`;
  const isTopicNull = !topicSetting || topicSetting === '全部分類';
  const topic = isTopicNull ? `` : ` and (Class eq '${topicSetting}')`;
  const isInputNull = inputSetting === null;
  const input = isInputNull ? `` : `${inputSetting}`;

  const renderData = (data) => {
    // Render Breadcrumbs
    const breadcrumbs = $('.breadcrumbs').find('li');
    const kindChinese = () => {
      switch (kind) {
        case 'ScenicSpot':
          return '探索景點';
        case 'Activity':
          return '節慶活動';
        case 'Restaurant':
          return '品嘗美食';
      }
    }
    const kindEnglish = () => {
      switch (kind) {
        case 'ScenicSpot':
          return 'scene';
        case 'Activity':
          return 'event';
        case 'Restaurant':
          return 'food';
      }
    }
    $(breadcrumbs[1]).find('a').text(kindChinese()).attr('href', `./${kindEnglish()}.html`);
    $(breadcrumbs[2]).find('a').text(citySetting)//.attr('href', `./${kindEnglish()}.html`);
    $(breadcrumbs[3]).text(inputSetting);

    // Render Slide
    const picture = [
      data.Picture.PictureUrl1 ? data.Picture.PictureUrl1 : "../images/noImage_x4.png",
      data.Picture.PictureUrl2 ? data.Picture.PictureUrl2 : false,
      data.Picture.PictureUrl3 ? data.Picture.PictureUrl3 : false
    ]
    const slideDom = $('#slideContainer');
    const renderSlide = picture.flatMap((item) => {
      if (!item) return ``;
      return `<li><img src="${item}"/></li>`;
    })
    slideDom.html(renderSlide);
    slideDom.lightSlider({
      item: 1,
      loop:true,
      auto: false,
      addClass: 'customSlider',
      pauseOnHover: true,
      pause: 3000,
      slideMargin: 0,
      enableDrag: false,
    });

    // Render Information
    const infoDom = $('#infoContainer')
    infoDom.find('.info_title').text(inputSetting);
    const classes = [
      data.Class ? data.Class : ``,
      data.Class1 ? data.Class1 : ``,
      data.Class2 ? data.Class2 : ``,
      data.Class3 ? data.Class3 : ``,
    ]
    const renderTags = classes.flatMap((item) => {
      if (!item) return ``;
      return `<div class="info_tag">${item}</div>`
    })
    infoDom.find('.info_tags').html(renderTags);
    const description = data.Description ? `${data.Description}` : ``;
    const descriptionDetail = data.DescriptionDetail ? `${data.DescriptionDetail}` : ``;
    infoDom.find('#infoDetail .text').text(`${description}${descriptionDetail}`);
    const renderSceneData = () => {
      let renderResult = '';
      if (data.OpenTime) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">開放時間：</div>
          <div class="text">${data.OpenTime}</div>
        </div>
        `
      }
      if (data.Phone) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">服務電話：</div>
          <div class="text">${data.Phone}</div>
        </div>
        `
      }
      if (data.Address) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">景點地址：</div>
          <div class="text">${data.Address}</div>
        </div>
        `
      }
      if (data.WebsiteUrl) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">官方網站：</div>
          <div class="text">${data.WebsiteUrl}</div>
        </div>
        `
      }
      if (data.TicketInfo) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">票價資訊：</div>
          <div class="text">${data.TicketInfo}</div>
        </div>
        `
      }
      if (data.Remarks) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">注意事項：</div>
          <div class="text">${data.Remarks}</div>
        </div>
        `
      }
      return renderResult;
    }
    const renderEventData = () => {
      let renderResult = '';
      if (data.StartTime && data.EndTime) {
        const startDate = data.StartTime.split('T')[0].replaceAll('-','/');
        const startTime = data.StartTime.split('T')[1].split('+')[0];
        const endDate = data.EndTime.split('T')[0].replaceAll('-','/');
        const endTime = data.EndTime.split('T')[1].split('+')[0];
        const eventTime = `${startDate} ${startTime} - ${endDate} ${endTime}`;
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">活動時間：</div>
          <div class="text">${eventTime}</div>
        </div>
        `
      }
      if (data.Phone) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">服務電話：</div>
          <div class="text">${data.Phone}</div>
        </div>
        `
      }
      if (data.Organizer) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">主辦單位：</div>
          <div class="text">${data.Organizer}</div>
        </div>
        `
      }
      if (data.Address) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">景點地址：</div>
          <div class="text">${data.Address}</div>
        </div>
        `
      }
      if (data.WebsiteUrl) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">官方網站：</div>
          <div class="text">${data.WebsiteUrl}</div>
        </div>
        `
      }
      if (data.Charge) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">活動費用：</div>
          <div class="text">${data.Charge}</div>
        </div>
        `
      }
      if (data.Remarks) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">注意事項：</div>
          <div class="text">${data.Remarks}</div>
        </div>
        `
      }
      return renderResult;
    }
    const renderFoodData = () => {
      let renderResult = '';
      if (data.OpenTime) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">營業時間：</div>
          <div class="text">${data.OpenTime}</div>
        </div>
        `
      }
      if (data.Phone) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">聯絡電話：</div>
          <div class="text">${data.Phone}</div>
        </div>
        `
      }
      if (data.Address) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">餐廳地址：</div>
          <div class="text">${data.Address}</div>
        </div>
        `
      }
      if (data.WebsiteUrl) {
        renderResult += `
        <div class="info_rowDescription">
          <div class="title">官方網站：</div>
          <div class="text">${data.WebsiteUrl}</div>
        </div>
        `
      }
      return renderResult;
    }
    switch (kind) {
      case 'ScenicSpot':
        infoDom.find('#infoData').html(renderSceneData());
        break;
      case 'Activity':
        infoDom.find('#infoData').html(renderEventData());
        break;
      case 'Restaurant':
        infoDom.find('#infoData').html(renderFoodData());
        break;
    }
    const mapLon = data.Position.PositionLon;
    const mapLat = data.Position.PositionLat;
    const map = L.map('map')
    const mapPopup = L.popup()
    const mapUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const mapLayer = new L.TileLayer(mapUrl, {minZoom: 12, maxZoom: 18});
    const mapMarker = L.marker([mapLat, mapLon]);
    map.setView(new L.LatLng(mapLat, mapLon), 17);
    mapPopup.setContent(`${data.Name}`);
    map.addLayer(mapLayer);
    mapMarker.bindPopup(mapPopup).addTo(map).openPopup();
    console.log(renderTags);
  }
  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/${kind}?
    $filter=Name eq '${input}'${city}${topic}&$format=JSON`,
    { headers: getAuthority() }
  ).then((response) => {
    const datas = response.data;
    datas.flatMap((data) => {
      renderData(data);
      const positions = {
        'Lon': data.Position.PositionLon,
        'Lat': data.Position.PositionLat,
      }
      searchRecommend(kindSetting, citySetting, positions)
      sessionStorage.setItem('positions', JSON.stringify(positions));
    })
  });
}
function searchRecommend(kindSetting, citySetting, positionSetting) {
  const isKindNull = !kindSetting || kindSetting === null;
  const kind = isKindNull ? `` : `${kindSetting}`;
  const isCityNull = !citySetting || citySetting === '全部縣市';
  const isFood = () => {
    if (kind === 'Restaurant') {
      return ` and contains(City, '${citySetting}')`;
    }
    return ` and contains(Address, '${citySetting}')`;
  }
  const city = isCityNull ? `` : isFood();
  console.log(positionSetting)
  const position = `&$spatialFilter=nearby(${positionSetting.Lat}, ${positionSetting.Lon}, 10000)`;

  const selectDom = $('#infoRecommend');
  switch (kind) {
    case 'ScenicSpot':
      selectDom.find('.topWrapper .title').text('還有這些不能錯過的景點');
      selectDom.find('.topWrapper .text').text(`更多${citySetting}景點`);
      break;
    case 'Activity':
      selectDom.find('.topWrapper .title').text('還有這些不能錯過的活動');
      selectDom.find('.topWrapper .text').text(`更多${citySetting}活動`);
      break;
    case 'Restaurant':
      selectDom.find('.topWrapper .title').text('還有這些不能錯過的美食');
      selectDom.find('.topWrapper .text').text(`更多${citySetting}美食`);
      break;
  }
  const render = (data) => {
    return (`
      <div class="card_simple">
        <div class="img">
          <img src="${data.Picture.PictureUrl1 ? data.Picture.PictureUrl1 : "../images/noImage_x2.png"}">
        </div>
        <div class="title">${data.Name}</div>
        <div class="locationWrapper">
          <div class="icon"></div>
          <div class="text">${citySetting}</div>
        </div>
      </div>
    `)
  }
  console.log(kind);
  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/${kind}?
    $top=4${position}&$skip=1&$format=JSON`,
    { headers: getAuthority() }
  ).then((response) => {
    const datas = response.data;
    const item = datas.flatMap((data) => {
      return render(data);
    })
    selectDom.find('.card_simpleWrapper').html(item);
  });
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
  const sessionSettings = JSON.parse(sessionStorage.getItem('setting'));
  const isFromHome = sessionStorage.getItem('search');
  const isFromData = sessionStorage.getItem('config') ?
    JSON.parse(sessionStorage.getItem('config')) :
    sessionStorage.getItem('config');

  if (currentPage === '/information.html') {
    search(sessionSettings, 'searchData');
    const infoItems = $('#infoRecommend');
    infoItems.on('click', '.card_simple', function () {
      const citySetting = $(this).find('.locationWrapper .text').text();
      const inputSetting = $(this).find('.title').text();
      const searchCondition = {
        "kindSetting": sessionSettings.kindSetting,
        "citySetting": citySetting,
        "topicSetting": null,
        "inputSetting": inputSetting,
      }
      sessionStorage.setItem('setting', JSON.stringify(searchCondition));
      location.href = "./information.html";
    })
    const cityLink = $($('.breadcrumbs li a')[2]);
    cityLink.on('click', function () {
      const citySetting = $(this).text();
      const searchCondition = {
        "kindSetting": sessionSettings.kindSetting,
        "citySetting": citySetting,
        "topicSetting": null,
        "inputSetting": null,
      }
      sessionStorage.setItem('config', JSON.stringify(searchCondition));
      const redirect = $($('.breadcrumbs li a')[1]).attr('href');
      location.href = redirect;
    })
  }
  if (isFromData) {
    sessionStorage.setItem('config', null);
      $('#searchDropdown_city').find('.default .text').text(isFromData.citySetting);
      if (currentPage === '/scene.html') search(isFromData, 'searchScene');
      if (currentPage === '/event.html') search(isFromData, 'searchEvent');
      if (currentPage === '/food.html') search(isFromData, 'searchFood');
  }
  // 下拉元件
  handleDropdown();
  // 從首頁跳轉過來先判斷有沒有輸入關鍵字
  if (isFromHome) {
    sessionStorage.setItem('search', '');
    if (sessionSettings.inputSetting) {
      $('#search_keyword').val(sessionSettings.inputSetting);
      if (currentPage === '/scene.html') search(sessionSettings, 'searchScene');
      if (currentPage === '/event.html') search(sessionSettings, 'searchEvent');
      if (currentPage === '/food.html') search(sessionSettings, 'searchFood');
    };
  }
  // 首頁串 API
  if (currentPage === '/') {
    const searchCondition = {
      "kindSetting": '',
      "citySetting": '',
      "topicSetting": '',
      "inputSetting": '',
    }
    search(searchCondition, 'recentEvent');
    search(searchCondition, 'recentScene');
    search(searchCondition, 'recentFood');
    // 首頁連結資訊
    handleHomeItems();
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
    sessionStorage.setItem('setting', JSON.stringify(searchCondition))

    // 處理首頁時候的搜尋按鈕
    if (currentPage === '/') {
      sessionStorage.setItem('search', '1');
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

  // 點選
  const searchItems = $('#searchContainer')
  searchItems.on('click', '.card_simple', function() {
    console.log($(this));
    const page = $('#pagination')
    const pageC = page.pagination('getSelectedPageNum')
    console.log(pageC);
    page.pagination(5)
  })
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
