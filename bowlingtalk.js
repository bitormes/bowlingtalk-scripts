(function() {
  var isFront = false;
  var repositioned = false;

  function findRowsByName(nameFragment) {
    var result = [];
    document.querySelectorAll('[data-page-element="CheckoutProductCard/V2"]').forEach(function(c) {
      var n = c.querySelector('.elProductCardInfoName');
      if (n && n.textContent.toLowerCase().includes(nameFragment.toLowerCase())) result.push(c);
    });
    return result;
  }

  function getQty(rows) {
    var q = 0;
    var seen = [];
    rows.forEach(function(r) {
      var n = r.querySelector('.elProductCardInfoName');
      var key = n ? n.textContent.trim() : '';
      if (seen.indexOf(key) !== -1) return;
      seen.push(key);
      var inp = r.querySelector('input.elProductCardInput');
      if (inp) q += parseInt(inp.value) || 0;
    });
    return q;
  }

  function clickMinus(rows) {
    rows.forEach(function(r) {
      var inp = r.querySelector('input.elProductCardInput');
      if (!inp) return;
      var minus = r.querySelector('button.elProductCardInput');
      if (!minus) return;
      var clicks = 0;
      var interval = setInterval(function() {
        var current = parseInt(inp.value) || 0;
        if (current <= 0 || clicks >= 10) { clearInterval(interval); return; }
        minus.click();
        clicks++;
      }, 100);
    });
  }

  function hideRows(rows) {
    rows.forEach(function(r) {
      r.style.setProperty('display','none','important');
    });
  }

  function showRows(rows) {
    rows.forEach(function(r) {
      r.style.removeProperty('display');
    });
  }

  function addUpgradeHeader() {
    var existing = document.getElementById('upgrade-header');
    if (existing) {
      existing.style.removeProperty('display');
      return;
    }
    var logoClubRows = findRowsByName('front name & logo');
    if (!logoClubRows.length) return;
    var firstRow = logoClubRows[0];
    if (!firstRow.parentNode) return;
    var header = document.createElement('div');
    header.id = 'upgrade-header';
    header.style.cssText = 'text-align:center; padding:8px 16px; font-size:13px; font-weight:bold; color:#555; margin-top:4px;';
    header.textContent = 'Want to personalise your shirt? Upgrade below 👇';
    firstRow.parentNode.insertBefore(header, firstRow);
  }

  function hideUpgradeHeader() {
    var header = document.getElementById('upgrade-header');
    if (header) header.style.setProperty('display','none','important');
  }

  function repositionUpgradeRow() {
    if (repositioned) return;
    var allCards = document.querySelectorAll('[data-page-element="CheckoutProductCard/V2"]');
    var standardRow = null;
    var upgradeRow = null;
    allCards.forEach(function(c) {
      var n = c.querySelector('.elProductCardInfoName');
      if (!n) return;
      if (n.textContent.toLowerCase().includes('bowling talk t-shirt club') && !n.textContent.toLowerCase().includes('front name')) {
        if (!standardRow) standardRow = c;
      }
      if (n.textContent.toLowerCase().includes('front name & logo')) {
        if (!upgradeRow) upgradeRow = c;
      }
    });
    if (standardRow && upgradeRow && standardRow.parentNode) {
      standardRow.parentNode.insertBefore(upgradeRow, standardRow.nextSibling);
      repositioned = true;
    }
  }

  function styleStandardClubRows() {
    findRowsByName('bowling talk t-shirt club').forEach(function(r) {
      var n = r.querySelector('.elProductCardInfoName');
      if (!n) return;
      if (n.textContent.toLowerCase().includes('front name')) return;
      if (n.textContent.toLowerCase().includes('personalisation')) return;
      n.innerHTML = 'BOWLING TALK T-SHIRT CLUB <span style="background:#378ADD;color:white;font-size:10px;font-weight:bold;padding:2px 8px;border-radius:4px;margin-left:6px;vertical-align:middle;">MOST POPULAR</span>';
    });
  }

  function styleLogoClubRows() {
    findRowsByName('front name & logo').forEach(function(r) {
      r.style.background = '#FFD580';
      r.style.borderLeft = '3px solid #C47D0E';
      var n = r.querySelector('.elProductCardInfoName');
      if (n) n.innerHTML = '👑 BOWLING TALK PERSONALISED T-SHIRT CLUB';
      var desc = r.querySelector('.elProductCardInfoDescription');
      if (desc) {
        desc.textContent = 'Go personalised for $17.95 - includes your name + logo on the front! Then just $34.95/month (plus s+h) for a new top voted design every month.';
        desc.style.color = '#3D2800';
      }
      var price = r.querySelector('.elProductCardFinalPrice');
      if (price) price.style.color = '#3D2800';
    });
  }

  function isClubSelected() {
    return getQty(findRowsByName('bowling talk t-shirt club')) > 0;
  }

  function isLogoClubSelected() {
    return getQty(findRowsByName('front name & logo')) > 0;
  }

  function isOneOffSelected() {
    var q = 0;
    var seen = [];
    document.querySelectorAll('[data-page-element="CheckoutProductCard/V2"]').forEach(function(c) {
      var n = c.querySelector('.elProductCardInfoName');
      if (!n) return;
      if (n.textContent.toLowerCase().includes('t-shirt club')) return;
      if (n.textContent.toLowerCase().includes('logo')) return;
      if (n.textContent.toLowerCase().includes('name')) return;
      var inp = c.querySelector('input.elProductCardInput');
      if (!inp) return;
      var key = n.textContent.trim();
      if (seen.indexOf(key) === -1) {
        seen.push(key);
        q += parseInt(inp.value) || 0;
      }
    });
    return q > 0;
  }

  function updateUI() {
    var standardRows = findRowsByName('bowling talk t-shirt club');
    var logoClubRows = findRowsByName('front name & logo');
    var oneOffLogoRows = findRowsByName('premium front logo');
    var clubSelected = isClubSelected();
    var logoClubSelected = isLogoClubSelected();
    var oneOffSelected = isOneOffSelected();

    var pureStandardRows = standardRows.filter(function(r) {
      var n = r.querySelector('.elProductCardInfoName');
      return n && !n.textContent.toLowerCase().includes('front name') && !n.textContent.toLowerCase().includes('personalisation');
    });

    if (logoClubSelected && clubSelected) {
      clickMinus(pureStandardRows);
      setTimeout(function() {
        hideRows(pureStandardRows);
        showRows(logoClubRows);
        styleLogoClubRows();
        hideUpgradeHeader();
      }, 1200);
      return;
    }

    if (logoClubSelected) {
      hideRows(pureStandardRows);
      hideRows(oneOffLogoRows);
      showRows(logoClubRows);
      styleLogoClubRows();
      hideUpgradeHeader();
      return;
    }

    if (clubSelected) {
      showRows(pureStandardRows);
      showRows(logoClubRows);
      hideRows(oneOffLogoRows);
      styleStandardClubRows();
      styleLogoClubRows();
      addUpgradeHeader();
      return;
    }

    if (oneOffSelected && !clubSelected && !logoClubSelected) {
      showRows(pureStandardRows);
      hideRows(logoClubRows);
      hideUpgradeHeader();
      if (!isFront) showRows(oneOffLogoRows);
      return;
    }

    showRows(pureStandardRows);
    hideRows(logoClubRows);
    hideRows(oneOffLogoRows);
    hideUpgradeHeader();
  }

  function shirtQty() {
    var q = 0;
    var seen = [];
    document.querySelectorAll('[data-page-element="CheckoutProductCard/V2"]').forEach(function(c) {
      var n = c.querySelector('.elProductCardInfoName');
      if (!n) return;
      if (n.textContent.toLowerCase().includes('t-shirt club')) return;
      if (n.textContent.toLowerCase().includes('logo')) return;
      if (n.textContent.toLowerCase().includes('name')) return;
      var inp = c.querySelector('input.elProductCardInput');
      if (!inp) return;
      var key = n.textContent.trim();
      if (seen.indexOf(key) === -1) {
        seen.push(key);
        q += parseInt(inp.value) || 0;
      }
    });
    return q;
  }

  function updateBanner() {
    var banner = document.getElementById('personalisation-banner');
    var text = document.getElementById('personalisation-banner-text');
    var badge = document.getElementById('personalisation-banner-badge');
    var notice = document.getElementById('personalisation-front-notice');
    if (isFront) {
      if (banner) banner.style.display='none';
      if (notice) notice.style.display='block';
      return;
    }
    if (notice) notice.style.display='none';
    var q = shirtQty();
    if (!banner||!text||!badge) return;
    if (q===0) { banner.style.display='none'; return; }
    banner.style.display='block';
    var t = (q*9.95).toFixed(2);
    var w = q===1?'item':'items';
    text.innerHTML='You have <strong>'+q+' '+w+'</strong> — personalisation would be <strong>$'+t+'</strong> ($9.95 per item). Add it below!';
    badge.textContent=q+' '+w;
  }

  function attachRadioListeners() {
    var radios = document.querySelectorAll('input[name="design_placement"]');
    radios.forEach(function(r) {
      r.addEventListener('click', function() {
        var val = this.value;
        var h = document.getElementById('design_placement');
        if (h) h.value = val;
        isFront = (val === 'Front print');
        if (isFront) {
          var oneOffLogoRows = findRowsByName('premium front logo');
          var logoClubRows = findRowsByName('front name & logo');
          clickMinus(oneOffLogoRows);
          clickMinus(logoClubRows);
          setTimeout(function() {
            hideRows(oneOffLogoRows);
            hideRows(logoClubRows);
          }, 1100);
        } else {
          updateUI();
        }
        updateBanner();
      });
    });
  }

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('elProductCardInput')) {
      setTimeout(function() {
        updateUI();
        updateBanner();
      }, 200);
    }
  });

  document.addEventListener('input', function(e) {
    if (e.target.classList.contains('elProductCardInput')) {
      setTimeout(function() {
        updateUI();
        updateBanner();
      }, 200);
    }
  });

  setTimeout(function() {
    attachRadioListeners();
    repositionUpgradeRow();
    updateUI();
    updateBanner();
  }, 2000);
})();
