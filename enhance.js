(function () {

  /* ── helpers ─────────────────────────────────────────────── */
  function isRealChart(img) {
    if (img.closest('td') || img.closest('th')) return false;
    if (img.closest('.ca-chart-widget')) return false;
    var w = img.naturalWidth || img.offsetWidth;
    var h = img.naturalHeight || img.offsetHeight;
    if (w > 0 && w < 80) return false;
    if (h > 0 && h < 60) return false;
    return true;
  }

  var chartLabels = [
    'Bitcoin Exchange Rate', 'Monthly BTC Rate',
    'Ethereum Exchange Rate', 'Monthly ETH Rate',
    'Abuse Type Distribution', 'Annual Statistics',
    'Total Stolen Funds', 'DeFi Crime Overview',
    'Source Distribution', 'Transaction Volume',
    'Ransomware Activity', 'Extortion Data',
    'Blackmail Scam Data', 'DarkNet Market',
    'Bitcoin Tumbler Data', 'Sanctions Data',
  ];
  var chartIdx = 0;

  /* ── main ────────────────────────────────────────────────── */
  function run() {

    /* 1. Wrap real chart images in dashboard widgets */
    document.querySelectorAll('img[src^="data:image/png"]').forEach(function (img) {
      if (!isRealChart(img)) return;
      img.classList.add('ca-real-chart');

      var widget = document.createElement('div');
      widget.className = 'ca-chart-widget';

      var header = document.createElement('div');
      header.className = 'ca-chart-header';
      var title = document.createElement('span');
      title.className = 'ca-chart-title';
      title.textContent = chartLabels[chartIdx % chartLabels.length];
      chartIdx++;
      header.appendChild(title);
      widget.appendChild(header);
      img.parentNode.insertBefore(widget, img);
      widget.appendChild(img);
    });

    /* 2. Add terminal accent to headings inside cards */
    document.querySelectorAll(
      'div[style*="background-color: white"] h1,' +
      'div[style*="background-color: white"] h2,' +
      'div[style*="background-color: white"] h3,' +
      'div[style*="background-color:white"] h2,' +
      'div[style*="background-color:white"] h3'
    ).forEach(function (h) {
      h.classList.add('ca-card-heading');
    });

    /* 3. Force every table cell dark (belt-and-suspenders) */
    document.querySelectorAll('.table td, .table th').forEach(function (cell) {
      cell.style.setProperty('background-color', cell.closest('thead') ? '#111927' : '', '');
    });

    /* 4. Use MutationObserver to catch cells added by React re-renders */
    var tableObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          node.querySelectorAll && node.querySelectorAll('.table td, .table th').forEach(forceDark);
          if ((node.tagName === 'TD' || node.tagName === 'TH') && node.closest('.table')) forceDark(node);
        });
      });
    });
    tableObserver.observe(document.body, { childList: true, subtree: true });

    function forceDark(cell) {
      var inHead = cell.closest('thead');
      if (inHead) {
        cell.style.setProperty('background-color', '#111927', 'important');
        cell.style.setProperty('color', '#9FEF00', 'important');
      } else {
        var tr = cell.closest('tr');
        var rows = tr && tr.parentElement ? Array.from(tr.parentElement.children) : [];
        var idx = rows.indexOf(tr);
        var isOdd = idx % 2 === 0;
        cell.style.setProperty('background-color', isOdd ? '#1e2d40' : '#243447', 'important');
        cell.style.setProperty('color', '#a4b1cd', 'important');
        cell.style.setProperty('border-color', '#253a52', 'important');
      }
    }

    /* 5. Force dark on ALL existing cells right now */
    document.querySelectorAll('.table td').forEach(forceDark);
    document.querySelectorAll('.table th').forEach(forceDark);

    /* 6. Highlight money value cells specifically */
    document.querySelectorAll('td[id="value"]').forEach(function (td) {
      td.style.setProperty('color', '#9FEF00', 'important');
      td.style.setProperty('font-family', "'JetBrains Mono', monospace", 'important');
      td.style.setProperty('font-weight', '700', 'important');
    });

    /* 7. Wallet address monospace (strict patterns only) */
    document.querySelectorAll('.table tbody td').forEach(function (td) {
      var text = td.textContent.trim();
      if (/^[13bc][a-km-zA-HJ-NP-Z1-9]{25,41}$/.test(text) ||
          /^0x[a-fA-F0-9]{40}$/.test(text)) {
        td.style.fontFamily = "'JetBrains Mono', monospace";
        td.style.fontSize = '0.75rem';
      }
    });

    /* 8. Dark page wrapper */
    document.querySelectorAll('div').forEach(function (div) {
      var s = div.getAttribute('style') || '';
      if ((s.includes('paddingBottom') || s.includes('padding-bottom')) &&
          !div.classList.contains('ca-enhanced')) {
        div.style.setProperty('background', '#141d2b', 'important');
        div.classList.add('ca-enhanced');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 900); });
  } else {
    setTimeout(run, 900);
  }

})();
