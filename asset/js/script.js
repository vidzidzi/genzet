/* ================================================================
   SCRIPT.JS - Gmail Dot Generator By Vidzidzi
   Format Pesan WhatsApp Rapi
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
    console.log('%c💰 Harga Premium: Rp 299.999', 'font-size:14px; color:#f9ab00; font-weight:bold;');
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
    usedCodes: [],
    orderSubmitted: false
};

// ===== KONFIGURASI WHATSAPP ADMIN =====
const WA_CONFIG = {
    adminNumber: '6281311083156', // Ganti dengan nomor admin
    adminName: 'Vidzidzi',
    price: 'Rp 299.999'
};


// ================================================================
// 4. GENERATE KODE PREMIUM UNIK
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
// 5. VERIFIKASI KODE PREMIUM
// ================================================================

function verifyPremiumCode(inputCode, phone, name, date) {
    var expectedCode = generatePremiumCode(phone, name, date);
    return inputCode === expectedCode;
}


// ================================================================
// 6. FORM ORDER PREMIUM
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
    if (_0xstate.premium) {
        alert('✅ Anda sudah memiliki akses Premium!');
        return;
    }
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

// ===== SUBMIT ORDER - FORMAT PESAN RAPI =====
orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = orderName.value.trim();
    const phone = orderPhone.value.trim();
    const date = orderDate.value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const paymentLabel = paymentMethod === 'qris' ? 'QRIS DANA' : 'Transfer DANA';
    
    // Validasi
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
    
    // ===== GENERATE KODE PREMIUM =====
    const today = new Date();
    const premiumCode = generatePremiumCode(phone, name, today);
    
    window._pendingCode = {
        code: premiumCode,
        phone: phone,
        name: name,
        date: today.toISOString()
    };
    
    orderResult.style.display = 'block';
    orderResult.className = 'loading';
    orderResult.innerHTML = '⏳ Mengirim pesan ke Admin...';
    
    // ================================================================
    // ===== FORMAT PESAN WHATSAPP YANG RAPI =====
    // ================================================================
    var adminMessage = '';
    adminMessage += '📧 *ORDER PREMIUM - Gmail Dot Generator By Vidzidzi*%0A%0A';
    adminMessage += '━━━━━━━━━━━━━━━━━━━━━━━━━━━%0A';
    adminMessage += '👤 *Nama:* ' + name + '%0A';
    adminMessage += '📱 *No HP:* ' + phone + '%0A';
    adminMessage += '📅 *Tanggal:* ' + date + '%0A';
    adminMessage += '💳 *Metode Bayar:* ' + paymentLabel + '%0A';
    adminMessage += '💰 *Harga:* ' + WA_CONFIG.price + '%0A';
    adminMessage += '━━━━━━━━━━━━━━━━━━━━━━━━━━━%0A%0A';
    adminMessage += '🔑 *KODE PREMIUM (RAHASIA):*%0A';
    adminMessage += '```' + premiumCode + '```%0A%0A';
    adminMessage += '━━━━━━━━━━━━━━━━━━━━━━━━━━━%0A';
    adminMessage += '⏳ *Status:* Menunggu Konfirmasi Pembayaran%0A%0A';
    adminMessage += '📌 *INSTRUKSI ADMIN:*%0A';
    adminMessage += '1️⃣ Cek pembayaran user (Rp 299.999)%0A';
    adminMessage += '2️⃣ Jika sudah bayar, KIRIMKAN KODE di atas ke user via WhatsApp%0A';
    adminMessage += '3️⃣ User akan aktivasi sendiri di website dengan kode tersebut%0A%0A';
    adminMessage += '⚠️ *JANGAN BOCORKAN KODE INI DI WEBSITE!*%0A';
    adminMessage += '━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    
    const encodedAdminMessage = encodeURIComponent(adminMessage);
    const waAdminUrl = 'https://wa.me/' + WA_CONFIG.adminNumber + '?text=' + encodedAdminMessage;
    
    // ===== TAMPILKAN HASIL KE USER =====
    setTimeout(function() {
        _0xstate.orderSubmitted = true;
        
        // MUNCULKAN KOLOM AKTIVASI
        const activationSection = document.getElementById('activationSection');
        activationSection.style.display = 'block';
        
        setTimeout(function() {
            activationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
        orderResult.className = 'success';
        orderResult.innerHTML = `
            ✅ <strong>Order berhasil dikirim ke Admin!</strong>
            <div style="background:#e6f4ea;padding:15px;border-radius:8px;margin:10px 0;border-left:4px solid #0d652d;">
                <p style="font-size:0.95rem;color:#0d652d;">
                    ✅ <strong>Pesan order sudah terkirim ke Admin.</strong><br>
                    Admin akan menghubungi Anda setelah pembayaran dikonfirmasi.
                </p>
            </div>
            <p style="font-size:0.9rem;color:#5f6368;">
                Silakan lanjutkan pembayaran via <strong>${paymentLabel}</strong> sebesar <strong>${WA_CONFIG.price}</strong>.
            </p>
            <div style="margin:15px 0;text-align:center;">
                <a href="${waAdminUrl}" target="_blank" class="btn-wa" onclick="window.open('${waAdminUrl}','_blank');">
                    💬 Chat Admin (Kirim Bukti Bayar)
                </a>
            </div>
            <div style="background:#fff8e1;padding:12px;border-radius:8px;margin:10px 0;border:1px solid #ffecb3;">
                <p style="font-size:0.9rem;color:#5f6368;">
                    📌 <strong>Langkah Selanjutnya:</strong><br>
                    1️⃣ Lakukan pembayaran <strong>${WA_CONFIG.price}</strong> via <strong>${paymentLabel}</strong><br>
                    2️⃣ Kirim bukti transfer ke Admin via WhatsApp<br>
                    3️⃣ Admin akan mengirimkan <strong>KODE PREMIUM</strong> ke WhatsApp Anda<br>
                    4️⃣ Masukkan kode di kolom <strong>"Aktivasi Kode Premium"</strong> di bawah
                </p>
            </div>
            <div style="background:#e8f0fe;padding:12px;border-radius:8px;margin:10px 0;border:1px solid #1a73e8;">
                <p style="font-size:0.95rem;color:#1a73e8;">
                    🔑 <strong>Kolom Aktivasi sudah muncul di bawah!</strong><br>
                    Masukkan kode yang dikirim Admin untuk mengaktifkan Premium.
                </p>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">
                <button class="btn-secondary" onclick="closeOrderModal()">
                    Tutup
                </button>
            </div>
        `;
        
        window.open(waAdminUrl, '_blank');
        
        window._lastOrder = { name, phone, date, paymentMethod, paymentLabel, code: premiumCode };
    }, 1500);
});

function closeOrderModal() {
    modal.style.display = 'none';
}


// ================================================================
// 7. KOLOM AKTIVASI KODE PREMIUM
// ================================================================

const activationCode = document.getElementById('activationCode');
const activationPhone = document.getElementById('activationPhone');
const activationName = document.getElementById('activationName');
const activateBtn = document.getElementById('activateBtn');
const activationResult = document.getElementById('activationResult');

activateBtn.addEventListener('click', function() {
    if (!_0xstate.orderSubmitted) {
        activationResult.className = 'error';
        activationResult.innerHTML = '⚠️ Silakan order premium terlebih dahulu sebelum aktivasi.';
        return;
    }
    
    const code = activationCode.value.trim().toUpperCase();
    const phone = activationPhone.value.trim();
    const name = activationName.value.trim();
    
    if (!code || code.length < 8) {
        activationResult.className = 'error';
        activationResult.innerHTML = '⚠️ Masukkan kode premium yang valid (8 karakter).';
        return;
    }
    if (!phone || phone.length < 10) {
        activationResult.className = 'error';
        activationResult.innerHTML = '⚠️ Masukkan nomor HP pendaftaran.';
        return;
    }
    if (!name || name.length < 3) {
        activationResult.className = 'error';
        activationResult.innerHTML = '⚠️ Masukkan nama pendaftaran.';
        return;
    }
    
    activationResult.className = 'loading';
    activationResult.innerHTML = '⏳ Memverifikasi kode...';
    
    setTimeout(function() {
        const today = new Date();
        const isValid = verifyPremiumCode(code, phone, name, today);
        
        let isPendingMatch = false;
        if (window._pendingCode) {
            isPendingMatch = code === window._pendingCode.code && 
                           phone === window._pendingCode.phone &&
                           name === window._pendingCode.name;
        }
        
        if (isValid || isPendingMatch) {
            _0xstate.premium = true;
            document.getElementById('premiumAccess').style.display = 'none';
            document.getElementById('premiumStatus').style.display = 'block';
            
            const resultInfo = document.getElementById('resultInfo');
            resultInfo.className = 'info-box success';
            resultInfo.innerHTML = `
                <div class="success-message">
                    🎉 <strong>Premium Aktif!</strong> 
                    Selamat! Anda sekarang dapat menghasilkan variasi tidak terbatas.
                </div>
            `;
            
            activationResult.className = 'success';
            activationResult.innerHTML = `
                ✅ <strong>Premium berhasil diaktifkan!</strong>
                <p style="margin-top:5px;">Selamat menikmati fitur unlimited.</p>
            `;
            
            activationCode.value = '';
            activationPhone.value = '';
            activationName.value = '';
            window._pendingCode = null;
            
            alert('✅ Premium berhasil diaktifkan! Selamat menikmati fitur unlimited.');
            
        } else {
            activationResult.className = 'error';
            activationResult.innerHTML = `
                ❌ <strong>Kode tidak valid.</strong>
                <p style="font-size:0.9rem;margin-top:5px;">
                    Pastikan kode, nomor HP, dan nama sesuai dengan data pendaftaran.
                    Jika masalah berlanjut, hubungi admin via WhatsApp.
                </p>
                <button class="btn-secondary" style="margin-top:10px;padding:8px 20px;font-size:0.85rem;" 
                        onclick="window.open('https://wa.me/${WA_CONFIG.adminNumber}','_blank');">
                    💬 Hubungi Admin
                </button>
            `;
        }
    }, 1000);
});

// Enter key support
activationCode.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') activateBtn.click();
});
activationPhone.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') activateBtn.click();
});
activationName.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') activateBtn.click();
});


// ================================================================
// 8. LOGIKA GENERATOR
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
        infoMsg += ' (batas gratis: ' + _0xstate.maxFree + ' per username). ';
        if (_0xstate.orderSubmitted) {
            infoMsg += 'Masukkan kode aktivasi di bawah ➜';
        } else {
            infoMsg += '<a href="#upgradeSection" style="color:#1a73e8;">Order Premium ➜</a>';
        }
    } else if (!_0xstate.premium) {
        infoMsg += ' (' + totalPossible + ' kemungkinan total)';
    } else {
        infoMsg += ' (Premium: unlimited)';
    }
    
    resultInfo.className = 'info-box success';
    resultInfo.innerHTML = '<p>' + infoMsg + '</p>';
}


// ================================================================
// 9. DOWNLOAD, COPY, CLEAR
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
// 10. EVENT & INIT
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
console.log('💰 Harga: ' + WA_CONFIG.price);