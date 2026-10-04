// Google sign-in + saving the filer profiles to the user's own Firestore document (users/{uid}).
// Without a filled-in firebase-config.js the app works exactly as before (profiles stay in this browser).
(function(){
  var cfg=window.FIREBASE_CONFIG,btn=document.getElementById('login');
  if(!btn)return;
  var ok=!!(cfg&&cfg.apiKey&&cfg.projectId&&!/PASTE|YOUR_/i.test(cfg.apiKey+cfg.projectId));
  var V='10.12.5',BASE='https://www.gstatic.com/firebasejs/'+V+'/';
  var auth=null,db=null,user=null,timer=null,pulling=false,starting=null;
  var say=function(t,bad){if(typeof msg==='function')msg(t,bad)};
  function load(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=res;s.onerror=function(){rej(new Error('Could not load '+src))};document.head.appendChild(s)})}
  function label(){
    if(user){var n=(user.displayName||user.email||'').split(' ')[0];btn.textContent='Log out'+(n?' ('+n+')':'');btn.title='Signed in as '+(user.email||n)+'. Filer profiles are saved to your account.'}
    else{btn.textContent='Log in';btn.title='Sign in with Google to save your filer profiles to your account'}
  }
  function start(){
    if(starting)return starting;
    starting=(window.firebase&&firebase.auth?Promise.resolve():
      load(BASE+'firebase-app-compat.js').then(function(){return load(BASE+'firebase-auth-compat.js')}).then(function(){return load(BASE+'firebase-firestore-compat.js')}))
    .then(function(){
      if(!firebase.apps.length)firebase.initializeApp(cfg);
      auth=firebase.auth();db=firebase.firestore();
      auth.onAuthStateChanged(function(u){user=u;label();if(u)pull()});
    }).catch(function(e){starting=null;throw e});
    return starting;
  }
  function pull(){
    pulling=true;
    return db.collection('birdat_users').doc(user.uid).get().then(function(d){
      var remote={};try{remote=JSON.parse((d.exists&&d.data().profiles)||'{}')}catch(e){}
      var local=getP(),merged=Object.assign({},local,remote);   // the account's copy wins when a name exists in both
      var changed=JSON.stringify(merged)!==JSON.stringify(remote);
      localStorage.setItem(PK,JSON.stringify(merged));
      fillProfiles($('#pf_list').value||(localStorage.getItem(PL)||''));
      say('Signed in as '+(user.email||user.displayName)+'. '+Object.keys(merged).length+' saved filer profile(s) are in your account.');
      if(changed)return push(merged,true);
    }).catch(function(e){say('Signed in, but the saved profiles could not be loaded: '+(e.code||e.message)+'. Check the Firestore rules.',1)})
    .then(function(){pulling=false});
  }
  function push(o,now){
    if(!user||pulling&&!now)return;
    clearTimeout(timer);
    var run=function(){return db.collection('birdat_users').doc(user.uid).set({profiles:JSON.stringify(o),email:user.email||'',updated:firebase.firestore.FieldValue.serverTimestamp()},{merge:true})
      .catch(function(e){say('Could not save your profiles to your account: '+(e.code||e.message),1)})};
    if(now)return run();
    timer=setTimeout(run,600);
  }
  window.cloudPush=function(o){push(o)};
  btn.addEventListener('click',function(){
    if(!ok){say('Login is not set up yet. Paste your Firebase config into firebase-config.js (see README).',1);return}
    if(user){auth.signOut().then(function(){say('Signed out. Your profiles stay in your account and are loaded again when you log in.')});return}
    start().then(function(){
      return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }).catch(function(e){
      var c=e&&e.code;
      if(c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request')return;
      say(c==='auth/unauthorized-domain'?'This website address is not allowed yet. In Firebase: Authentication > Settings > Authorized domains, add '+location.hostname+'.':
          c==='auth/popup-blocked'?'The sign-in window was blocked. Allow pop-ups for this site and try again.':
          'Could not sign in: '+((e&&(e.code||e.message))||e),1);
    });
  });
  label();
  // restore an earlier sign-in quietly when online
  if(ok&&navigator.onLine!==false)start().catch(function(){});
})();
