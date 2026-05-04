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

  function clickMinusToZero(rows) {
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
      }, 80);
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

  function tagAllRows() {
    document.querySelectorAll('[data-page-element="CheckoutProductCard/V2"]').forEach(function(c) {
      if (c.getAttribute('data-row-type')) return;
      var n = c.querySelector('.elProductCardInfoName');
      if (!n) return;
      var text = n.textContent.toLowerCase();
      if (text.includes('front name & logo')) {
        c.setAttribute('data-row-type', 'logo-club');
      } else if (text.includes('bowling talk t-shirt club')) {
        c.setAttribute('data-row-type', 'standard-club');
      } else if (text.includes('premium front logo')) {
        c.setAttribute('data-row-type', 'one-off-logo');
      } else {
        c.setAttribute('data-row-type', 'shirt');
      }
    });
  }

  function getRowsByType(type) {
    var result = [];
    document.querySelectorAll('[data-page-element="CheckoutProductCard/V2"][data-row-type="' + type + '"]').forEach(function(c) {
      result.push(c);
    });
    return result;
  }

  function addUpgradeHeader() {
    var existing = document.getElementById('upgrade-header');
    if (existing) {
      existing.style.removeProperty('display');
      return;
    }
    var logoClubRows = getRowsByType('logo-club');
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
    var standardRows = getRowsByType('standard-club');
    var upgradeRows = getRowsByType('logo-club');
    if (!standardRows.length || !upgradeRows.length) return;
    var standardRow = standardRows[0];
    var upgradeRow = upgradeRows[0];
    if (standardRow.parentNode) {
      standardRow.parentNode.insertBefore(upgradeRow, standardRow.nextSibling);
      repositioned = true;
    }
  }

  function styleStandardClubRows() {
    getRowsByType('standard-club').forEach(function(r) {
      var n = r.querySelector('.elProductCardInfoName');
      if (!n) return;
      if (n.innerHTML.includes('MOST POPULAR')) return;
      n.innerHTML = 'BOWLING TALK T-SHIRT CLUB <span style="background:#378ADD;color:white;font-size:10px;font-weight:bold;padding:2px 8px;border-radius:4px;margin-left:6px;vertical-align:middle;">MOST POPULAR</span>';
    });
  }

  function styleLogoClubRows() {
    getRowsByType('logo-club').forEach(function(r) {
      r.style.background = '#FFD580';
      r.style.borderLeft = '3px solid #C47D0E';
      var n = r.querySelector('.elProductCardInfoName');
      if (n) n.innerHTML = '&#x27A1;&#xFE0F; UPGRADE - Add Your Name & Logo to the Front';
      var desc = r.querySelector('.elProductCardInfoDescription');
      if (desc) {
        desc.textContent = 'Upgrade your club and get this t-shirt personalised for just $17.95, and then receive a top voted t-shirt every month for just $34.95 (plus s+h).';
        desc.style.color = '#3D2800';
      }
      var price = r.querySelector('.elProductCardFinalPrice');
      if (price) price.style.color = '#3D2800';
    });
  }

  function isClubSelected() {
    return getQty(getRowsByType('standard-club')) > 0;
  }

  function isLogoClubSelected() {
    return getQty(getRowsByType('logo-club')) > 0;
  }

  function isOneOffSelected() {
    return getQty(getRowsByType('shirt')) > 0;
  }

  function applyFrontPrintState() {
    var standardRows = getRowsByType('standard-club');
    var logoClubRows = getRowsByType('logo-club');
    var oneOffLogoRows = getRowsByType('one-off-logo');
    hideRows(logoClubRows);
    hideRows(oneOffLogoRows);
    hideUpgradeHeader();
    showRows(standardRows);
    styleStandardClubRows();
    clickMinusToZero(logoClubRows);
    clickMinusToZero(oneOffLogoRows);
    setTimeout(function() {
      hideRows(logoClubRows);
      hideRows(oneOffLogoRows);
      clickMinusToZero(logoClubRows);
      clickMinusToZero(oneOffLogoRows);
    }, 1500);
  }

  function updateUI() {
    var standardRows = getRowsByType('standard-club');
    var logoClubRows = getRowsByType('logo-club');
    var oneOffLogoRows = getRowsByType('one-off-logo');
    var clubSelected = isClubSelected();
    var logoClubSelected = isLogoClubSelected();
    var oneOffSelected = isOneOffSelected();

    if (isFront) {
      applyFrontPrintState();
      return;
    }

    if (logoClubSelected) {
      hideRows(standardRows);
      hideRows(oneOffLogoRows);
      clickMinusToZero(oneOffLogoRows);
      showRows(logoClubRows);
      styleLogoClubRows();
      hideUpgradeHeader();
      if (clubSelected) clickMinusToZero(standardRows);
      return;
    }

    if (clubSelected) {
      showRows(standardRows);
      showRows(logoClubRows);
      hideRows(oneOffLogoRows);
      clickMinusToZero(oneOffLogoRows);
      styleStandardClubRows();
      styleLogoClubRows();
      addUpgradeHeader();
      return;
    }

    if (oneOffSelected) {
      showRows(standardRows);
      hideRows(logoClubRows);
      showRows(oneOffLogoRows);
      hideUpgradeHeader();
      return;
    }

    showRows(standardRows);
    hideRows(logoClubRows);
    hideRows(oneOffLogoRows);
    hideUpgradeHeader();
  }

  function shirtQty() {
    var q = 0;
    var seen = [];
    getRowsByType('shirt').forEach(function(c) {
      var n = c.querySelector('.elProductCardInfoName');
      if (!n) return;
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

  function updateDesignPlacementField(val) {
    var field = document.querySelector('textarea[data-custom-type="Design_Placement"]');
    if (field) {
      field.value = val;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function attachRadioListeners() {
    var radios = document.querySelectorAll('input[name="design_placement"]');
    radios.forEach(function(r) {
      r.addEventListener('click', function() {
        var val = this.value;
        var h = document.getElementById('design_placement');
        if (h) h.value = val;
        isFront = (val === 'Front print');
        sessionStorage.setItem('bt_design_placement', val);
        updateDesignPlacementField(val);
        updateUI();
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
    tagAllRows();
    attachRadioListeners();
    repositionUpgradeRow();
    styleStandardClubRows();
    updateUI();
    updateBanner();
    if (!sessionStorage.getItem('bt_design_placement')) {
      sessionStorage.setItem('bt_design_placement', 'Back print');
    }
    updateDesignPlacementField(sessionStorage.getItem('bt_design_placement') || 'Back print');
  }, 2000);
})();
