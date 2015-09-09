/* -*- js-indent-level: 4; -*- */

"use strict";

module.exports = well1024a;

// ---- IF BROWSER, CUT ALONG LINE ----
function well1024a (entropy_) {
    var entropy = entropy_ || [];
    var m1 = 3, m2 = 24, m3 = 10;
    var state = [ 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0 ];
    var state_i = 0;
    var z0, z1, z2;
    function mat0pos (t, v) { return v ^ (v >>> t); }
    function mat0neg (t, v) { return v ^ (v << -t); }
    
    function init (entropy) {
        for (var i = 0; i < state.length; i++)
            state[i] = ~(Math.random() * 4294967296);
        var s_i = 0;
        for (var i = 0; i < entropy.length; i++) {
            state[s_i] = (state[s_i] + Math.floor(entropy[i])) & 0xffffffff;
            s_i = (s_i + 1) & 0x1f;
        }
        for (var i = 0; i < 31; i++)
            getUInt32();
    }

    function getState () {
        return state.slice(state_i).concat(state.slice(0, state_i));
    }

    function setState (s) {
        if (s.length != 32)
            throw new Error("Seed not 32-length array of 32-bit UINTs");
        for (var i = 0; i < s.length; i++) {
            if (s[i] != s[i] & 0xffffffff)
                throw new Error("Seed not 32-length array of 32-bit UINTs");
        }
        state = s.slice(0);
        state_i = 0;
    }
    
    function getUInt32 () {
        z0 = state[(state_i + 31) & 0x1f];
        z1 = state[state_i] ^ mat0pos(8, state[(state_i + m1) & 0x1f]);
        z2 = mat0neg(-19, state[(state_i + m2) & 0x1f]) ^ mat0neg(-14, state[(state_i + m3) & 0x1f]);
        state[state_i] = z1 ^ z2;
        state[(state_i + 31) & 0x1f] = mat0neg(-11, z0) ^ mat0neg(-7, z1) ^ mat0neg(-13, z2);
        state_i = (state_i + 31) & 0x1f;
        return state[state_i] >>> 0;
    }
    
    init(entropy);
    return { getState: getState,
             setState: setState,
             getUInt32: getUInt32 };
}
