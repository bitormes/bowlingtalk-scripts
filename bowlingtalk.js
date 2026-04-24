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

  function styleLogoClubRows() {
    findRowsByName('front name & logo').forEach(function(r) {
      r.style.background = '#EEF4FF';
      r.style.borderLeft = '3px solid #378ADD';
      var n = r.querySelector('.elProductCardInfoName');
      if (n) n.innerHTML = '🎳 BOWLING TALK T-SHIRT CLUB <span style="background:#378ADD;color:white;font-size:10px;font-weight:bold;padding:2px 7px;border-radius:4px;margin-left:6px;vertical-align:middle;">UPGRADE</span>';
      var desc = r.querySelector('.elProductCardInfoDescription');
      if (desc) desc.textContent = 'Get your first shirt for $17.95 - includes your name + logo on the front! Then just $34.95/month (plus s+h) for a new top voted design every month.';
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

    if (clubSelected && logoClubSelected) {
      clickMinus(standardRows);
      clubSelected = false;
    }

    if (logoClubSelected) {
      hideRows(standardRows);
      hideRows(oneOffLogoRows);
      showRows(logoClubRows);
      styleLogoClubRows();
      return;
    }

    if (clubSelected) {
      showRows(standardRows);
      showRows(logoClubRows);
      hideRows(oneOffLogoRows);
      styleLogoClubRows();
      return;
    }

    if (oneOffSelected && !clubSelected && !logoClubSelected) {
      showRows(standardRows);
      hideRows(logoClubRows);
      if (!isFront) showRows(oneOffLogoRows);
      return;
    }

    showRows(standardRows);
    hideRows(logoClubRows);
    hideRows(oneOffLogoRows);
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
