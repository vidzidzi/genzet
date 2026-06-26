/* ================================================================
   SCRIPT.JS - Gmail Dot Generator By Vidzidzi
   ================================================================ */

// ================================================================
// 1. KEAMANAN: ANTI-INSPECT & DEVTOOLS
// ================================================================
(function security() {
    'use strict';
    
    let devtoolsOpen = false;
    const threshold = 160;
    
    function detectDevTools() {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                document.body.innerHTML = `
                    <div style="text-align:center;margin-top:20%;padding:40px;font-family:'Segoe UI',sans-serif;">
                        <h1 style="color:#d93025;font-size:2.5rem;">⛔ Akses Ditolak</h1>
                        <p style="font-size:1.2rem;color:#333;">Inspect Element tidak diizinkan.</p>
                        <p style="color:#5f6368;font-size:0.9rem;margin-top:10px;">Gmail Dot Generator By Vidzidzi</p>
                    </div>
                `;
            }
        } else {
            devtoolsOpen = false;
        }
    }
    
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        alert('⛔ Klik kanan dinonaktifkan.');
        return false;
    });
    
    document.addEventListener('keydown', function(e) {
        const key = e.key;
        const ctrl = e.ctrlKey;
        const shift = e.shiftKey;
        
        if (key === 'F12' || (ctrl && shift && (key === 'I' || key === 'J')) || (ctrl && key === 'u') || (ctrl && shift && key === 'C')) {
            e.preventDefault();
            alert('⛔ Shortcut dinonaktifkan.');
            return false;
        }
    });
    
    setInterval(detectDevTools, 1000);
    
    console.log('%c📧 Gmail Dot Generator By Vidzidzi', 'font-size:18px; color:#1a73e8; font-weight:bold;');
    console.log('%c© 2026 - All Rights Reserved', 'font-size:12px; color:#5f6368;');
})();


// ================================================================
// 2. NAVIGASI TAB
// ================================================================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = {
    home: document.getElementById('tab-home'),
    generator: document.getElementById('tab-generator'),
    premium: document.getElementById('tab-premium')
};

function switchTab(tabName) {
    tabBtns.forEach(function(btn) {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    Object.keys(tabContents).forEach(function(key) {
        if (key === tabName) {
            tabContents[key].classList.add('active');
        } else {
            tabContents[key].classList.remove('active');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        switchTab(this.dataset.tab);
    });
});


// ================================================================
// 3. STATE & KONFIGURASI
// ================================================================

var _0xstate = {
    premium: false,
    results: [],
    maxFree: 10,
    usedCodes: []
};

// ===== KONFIGURASI WHATSAPP =====
// GANTI dengan nomor WhatsApp Business Admin Anda!
const WA_CONFIG = {
    adminNumber: '6281311083156',
    messageTemplate: `*📧 ORDER PREMIUM - Gmail Dot Generator By Vidzidzi*

👤 *Nama:* {name}
📱 *No HP:* {phone}
📅 *Tanggal:* {date}
💳 *Metode Bayar:* {payment}
💰 *Harga:* Rp 50.000

⏳ *Status:* Menunggu Konfirmasi Pembayaran

Silakan kirim bukti transfer setelah bayar.
Kode premium akan dikirim setelah pembayaran dikonfirmasi.`
};


// ================================================================
// 4. FORM ORDER PREMIUM
// ================================================================

// DOM Elements
const modal = document.getElementById('orderModal');
const showOrderBtn = document.getElementById('showOrderBtn');
const closeModal = document.getElementById('closeModal');
const orderForm = document.getElementById('orderForm');
const orderResult = document.getElementById('orderResult');
const orderDate = document.getElementById('orderDate');
const orderName = document.getElementById('orderName');
const orderPhone = document.getElementById('orderPhone');
const qrisInfo = document.getElementById('qrisInfo');
const transferInfo = document.getElementById('transferInfo');

// ===== SET TANGGAL OTOMATIS =====
function setOrderDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    orderDate.value = now.toLocaleDateString('id-ID', options);
}
setOrderDate();

// ===== TOGGLE METODE PEMBAYARAN =====
document.querySelectorAll('input[name="paymentMethod"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        if (this.value === 'qris') {
            qrisInfo.style.display = 'block';
            transferInfo.style.display = 'none';
        } else {
            qrisInfo.style.display = 'none';
            transferInfo.style.display = 'block';
        }
    });
});

// ===== BUKA MODAL =====
showOrderBtn.addEventListener('click', function() {
    modal.style.display = 'flex';
    orderResult.style.display = 'none';
    orderResult.className = '';
    orderResult.innerHTML = '';
    orderName.value = '';
    orderPhone.value = '';
    setOrderDate();
});

// ===== TUTUP MODAL =====
closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
});

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// ===== SUBMIT ORDER =====
orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = orderName.value.trim();
    const phone = orderPhone.value.trim();
    const date = orderDate.value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const paymentLabel = paymentMethod === 'qris' ? 'QRIS DANA' : 'Transfer DANA';
    
    if (!name || name.length < 3) {
        orderResult.style.display = 'block';
        orderResult.className = 'error';
        orderResult.innerHTML = '⚠️ Masukkan nama lengkap (minimal 3 karakter).';
        return;
    }
    if (!phone || phone.length < 10) {
        orderResult.style.display = 'block';
        orderResult.className = 'error';
        orderResult.innerHTML = '⚠️ Masukkan nomor HP yang valid (minimal 10 digit).';
        return;
    }
    if (!/^[0-9]+$/.test(phone)) {
        orderResult.style.display = 'block';
        orderResult.className = 'error';
        orderResult.innerHTML = '⚠️ Nomor HP hanya boleh angka.';
        return;
    }
    
    orderResult.style.display = 'block';
    orderResult.className = 'loading';
    orderResult.innerHTML = '⏳ Mengirim pesan ke Admin...';
    
    const message = WA_CONFIG.messageTemplate
        .replace(/{name}/g, name)
        .replace(/{phone}/g, phone)
        .replace(/{date}/g, date)
        .replace(/{payment}/g, paymentLabel);
    
    const encodedMessage = encodeURIComponent(message);
    const waUrl = 'https://wa.me/' + WA_CONFIG.adminNumber + '?text=' + encodedMessage;
    
    setTimeout(function() {
        orderResult.className = 'success';
        orderResult.innerHTML = `
            ✅ <strong>Order berhasil dikirim!</strong>
            <p style="margin:10px 0;">Pesan telah dikirim ke WhatsApp Admin.</p>
            <p style="font-size:0.9rem;color:#5f6368;">
                Silakan lanjutkan pembayaran via <strong>${paymentLabel}</strong>.
            </p>
            <div style="margin:15px 0;text-align:center;">
                <a href="${waUrl}" target="_blank" class="btn-wa" onclick="window.open('${waUrl}','_blank');">
                    💬 Buka WhatsApp
                </a>
            </div>
            <p style="font-size:0.8rem;color:#5f6368;">
                * Jika tombol tidak berfungsi, klik <a href="${waUrl}" target="_blank">link ini</a>
            </p>
            <button class="btn-secondary" onclick="closeOrderModal()" style="margin-top:10px;">
                Tutup
            </button>
        `;
        
        window.open(waUrl, '_blank');
        
        window._lastOrder = { name, phone, date, paymentMethod, paymentLabel };
    }, 1500);
});

function closeOrderModal() {
    modal.style.display = 'none';
}


// ================================================================
// 5. GENERATE KODE PREMIUM
// ================================================================

function generatePremiumCode(phone, name, date) {
    var nameParts = name.trim().split(' ');
    var threeSyllables = '';
    for (var i = 0; i < Math.min(3, nameParts.length); i++) {
        threeSyllables += nameParts[i].substring(0, 3);
    }
    while (threeSyllables.length < 9) {
        threeSyllables += 'x';
    }
    threeSyllables = threeSyllables.substring(0, 9);
    
    var now = new Date(date || Date.now());
    var dateStr = now.getFullYear() + 
                   String(now.getMonth() + 1).padStart(2, '0') + 
                   String(now.getDate()).padStart(2, '0');
    
    var raw = phone.substring(0, 3) + threeSyllables + dateStr.substring(6, 8);
    
    var hash = 0;
    for (var i = 0; i < raw.length; i++) {
        var charCode = raw.charCodeAt(i);
        hash = ((hash << 5) - hash) + charCode;
        hash = hash & hash;
    }
    
    var code = Math.abs(hash).toString(36).toUpperCase();
    while (code.length < 8) {
        code = 'A' + code;
    }
    code = code.substring(0, 8);
    
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var randomPart = '';
    for (var i = 0; i < 2; i++) {
        randomPart += chars[Math.floor(Math.random() * chars.length)];
    }
    code = code.substring(0, 6) + randomPart;
    
    return code;
}


// ================================================================
// 6. LOGIKA GENERATOR
// ================================================================

var form = document.getElementById('generatorForm');
var usernameInput = document.getElementById('username');
var countInput = document.getElementById('count');
var emailListInput = document.getElementById('emailList');
var resultArea = document.getElementById('resultArea');
var resultInfo = document.getElementById('resultInfo');
var downloadBtn = document.getElementById('downloadBtn');
var copyBtn = document.getElementById('copyBtn');
var clearBtn = document.getElementById('clearBtn');

function generateDotVariations(username) {
    var n = username.length;
    if (n === 0) return [];
    var total = 1 << (n - 1);
    var results = [];
    for (var mask = 0; mask < total; mask++) {
        var chars = [];
        for (var i = 0; i < n; i++) {
            chars.push(username[i]);
            if (i < n - 1 && (mask & (1 << i))) {
                chars.push('.');
            }
        }
        results.push(chars.join('') + '@gmail.com');
    }
    return results;
}

function getRandomSubset(arr, count) {
    if (count >= arr.length) return arr.slice();
    var shuffled = arr.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled.slice(0, count);
}

function handleGenerate(e) {
    e.preventDefault();
    
    var usernames = [];
    var singleUser = usernameInput.value.trim();
    var emailList = emailListInput.value.trim();

    if (emailList) {
        usernames = emailList.split('\n')
            .map(function(line) { return line.trim(); })
            .filter(function(line) { return line.includes('@gmail.com'); })
            .map(function(line) { return line.split('@')[0]; });
    } else if (singleUser) {
        usernames = [singleUser];
    } else {
        resultInfo.className = 'info-box error';
        resultInfo.innerHTML = '<p>⚠️ Masukkan username atau daftar email.</p>';
        return;
    }

    if (usernames.length === 0) {
        resultInfo.className = 'info-box error';
        resultInfo.innerHTML = '<p>⚠️ Tidak ada username valid.</p>';
        return;
    }

    var requestedCount = parseInt(countInput.value) || 10;
    var isLimited = false;

    if (!_0xstate.premium && requestedCount > _0xstate.maxFree) {
        requestedCount = _0xstate.maxFree;
        isLimited = true;
    }

    var allVariations = [];
    var totalPossible = 0;

    for (var u = 0; u < usernames.length; u++) {
        var user = usernames[u];
        if (!/^[a-zA-Z0-9]+$/.test(user)) {
            resultInfo.className = 'info-box error';
            resultInfo.innerHTML = '<p>⚠️ Username "' + user + '" hanya boleh huruf dan angka.</p>';
            return;
        }
        var variations = generateDotVariations(user);
        totalPossible += variations.length;
        
        var selected;
        if (_0xstate.premium || requestedCount >= variations.length) {
            selected = variations;
        } else {
            selected = getRandomSubset(variations, requestedCount);
        }
        allVariations = allVariations.concat(selected);
    }

    _0xstate.results = allVariations;
    resultArea.value = allVariations.join('\n');

    var infoMsg = '✅ Berhasil menghasilkan <strong>' + allVariations.length + '</strong> variasi';
    if (usernames.length > 1) {
        infoMsg += ' dari ' + usernames.length + ' username';
    }
    if (isLimited) {
        infoMsg += ' (batas gratis: ' + _0xstate.maxFree + ' per username). <a href="#upgradeSection" style="color:#1a73e8;">Upgrade ➜</a>';
    } else if (!_0xstate.premium) {
        infoMsg += ' (' + totalPossible + ' kemungkinan total)';
    } else {
        infoMsg += ' (Premium: unlimited)';
    }
    
    resultInfo.className = 'info-box success';
    resultInfo.innerHTML = '<p>' + infoMsg + '</p>';
}


// ================================================================
// 7. DOWNLOAD, COPY, CLEAR
// ================================================================

downloadBtn.addEventListener('click', function() {
    var text = resultArea.value;
    if (!text) { alert('Tidak ada data. Generate dulu!'); return; }
    var blob = new Blob([text], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'gmail_dot_variations_' + new Date().toISOString().slice(0,10) + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

copyBtn.addEventListener('click', function() {
    var text = resultArea.value;
    if (!text) { alert('Tidak ada data. Generate dulu!'); return; }
    navigator.clipboard.writeText(text).then(function() {
        alert('📋 Berhasil disalin!');
    }).catch(function() {
        alert('Gagal menyalin, silakan salin manual.');
    });
});

clearBtn.addEventListener('click', function() {
    if (resultArea.value && confirm('Hapus semua hasil?')) {
        resultArea.value = '';
        _0xstate.results = [];
        resultInfo.className = 'info-box';
        resultInfo.innerHTML = '<p>Hasil telah dikosongkan.</p>';
    }
});


// ================================================================
// 8. EVENT & INIT
// ================================================================

form.addEventListener('submit', handleGenerate);
window.addEventListener('load', function() {
    handleGenerate(new Event('submit'));
});

window.switchTab = switchTab;
window.closeOrderModal = closeOrderModal;
window.generatePremiumCode = generatePremiumCode;

console.log('📧 Gmail Dot Generator By Vidzidzi - Loaded Successfully!');
console.log('💡 Admin WhatsApp: ' + WA_CONFIG.adminNumber);