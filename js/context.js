
//console.log("AM I Executed?");

var bibit = Object();

bibit.searchForBibTex = function (keyword) {
  if (!keyword) {
    return;
  }
  var searchAjax = new XMLHttpRequest();
  searchAjax.onreadystatechange = function () {
    if (searchAjax.readyState == searchAjax.DONE && searchAjax.status == 200) {
      var res = JSON.parse(searchAjax.response);
      if (res.r && res.r.length) {
        var paperId = res.r[0].l.f.u.replace('#f', '');
        // console.log(paperId);
        var bibTexAjax = new XMLHttpRequest();
        bibTexAjax.onreadystatechange = function() {
          if (bibTexAjax.readyState == bibTexAjax.DONE && bibTexAjax.status == 200) {
            var retObj = JSON.parse(bibTexAjax.response);
            if (retObj && retObj.i[0].l == "BibTeX") {
              var bibTexUrl = "https://scholar.google.com" + retObj.i[0].u;
              // console.log(bibTexUrl);
              chrome.tabs.create({url : bibTexUrl});
            }
          }
        }
        bibTexAjax.open("GET", "https://scholar.google.com/scholar?output=gsb-cite&hl=en&q=info:" + paperId + ":scholar.google.com/");
        bibTexAjax.send();
      } else {
        // TODO: Alert user for error
        // document.getElementById('output-url').innerHTML = '<span style="color:red;">Sorry, we\'re not able to find specific paper.</span>';
        console.warn(" We\'re not able to find specific paper.");
      }
    }
  }
  searchAjax.open(
    "GET",
    "https://scholar.google.com/scholar?oi=gsb95&output=gsb&hl=en&q=" + encodeURI(keyword)
  );
  searchAjax.send();
};

bibit.getCurrentTabUrl = function (callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    console.log(tabs);
    var url = tab.url;
    console.log(url);
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
};

bibit.contextMenuSelectionId = chrome.contextMenus.create(
  {
    "title": "BibTex It for \"%s\" !",
    "contexts": ["selection"],
    "onclick": function (info, tab) {
      if (info.selectionText) {
        bibit.searchForBibTex(info.selectionText.replace(' ', '+'));
      } else {
        console.console.warn("No text is selected!");
      }
    }
  }
);

/*
bibit.contextMenuPageId = chrome.contextMenus.create(
  {
    "title": "BibTex This Page!",
    "contexts": ["page"],
    "onclick": function (info, tab) {
      bibit.getCurrentTabUrl(bibit.searchForBibTex);
    }
  }
);
*/
