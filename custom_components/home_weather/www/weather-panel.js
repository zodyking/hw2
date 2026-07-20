(()=>{var W={"--hw-bg":"#111111","--hw-surface":"#1c1c1c","--hw-surface-2":"#161616","--hw-elevated":"#282828","--hw-input-bg":"#282828","--hw-text":"#e1e1e1","--hw-muted":"#9b9b9b","--hw-disabled":"#6f6f6f","--hw-accent":"#03a9f4","--hw-accent-hover":"#29b6f6","--hw-accent-dim":"rgba(3, 169, 244, 0.15)","--hw-danger":"#f44336","--hw-warning":"#ff9800","--hw-success":"#4caf50","--hw-border":"#252525","--hw-border-strong":"#333333","--hw-hover":"#222222","--shadow-sm":"0 1px 2px rgba(0,0,0,0.3)","--shadow":"0 4px 6px rgba(0,0,0,0.4)","--shadow-md":"0 8px 16px rgba(0,0,0,0.5)","--shadow-lg":"0 16px 32px rgba(0,0,0,0.6)","--radius-sm":"6px","--radius-md":"10px","--radius-lg":"16px","--radius-xl":"20px","--radius-full":"9999px","--space-1":"4px","--space-2":"8px","--space-3":"12px","--space-4":"16px","--space-5":"24px","--space-6":"32px","--fs-xs":"11px","--fs-sm":"12px","--fs-body":"14px","--fs-md":"16px","--fs-lg":"20px","--fs-xl":"28px","--fs-2xl":"36px","--fs-hero":"clamp(64px, 18vw, 104px)","--ease":"cubic-bezier(0.4, 0, 0.2, 1)","--ease-in":"cubic-bezier(0.4, 0, 1, 1)","--ease-out":"cubic-bezier(0, 0, 0.2, 1)","--dur-fast":"150ms","--dur-normal":"250ms","--dur-slow":"400ms"},A={"--hw-bg":"#f5f5f5","--hw-surface":"#ffffff","--hw-surface-2":"#f0f0f0","--hw-elevated":"#e8e8e8","--hw-input-bg":"#ffffff","--hw-text":"#1a1a1a","--hw-muted":"#666666","--hw-disabled":"#999999","--hw-accent":"#0288d1","--hw-accent-hover":"#0277bd","--hw-accent-dim":"rgba(2, 136, 209, 0.12)","--hw-danger":"#d32f2f","--hw-warning":"#e65100","--hw-success":"#2e7d32","--hw-border":"#e0e0e0","--hw-border-strong":"#cccccc","--hw-hover":"#eeeeee","--shadow-sm":"0 1px 2px rgba(0,0,0,0.08)","--shadow":"0 4px 6px rgba(0,0,0,0.1)","--shadow-md":"0 8px 16px rgba(0,0,0,0.12)","--shadow-lg":"0 16px 32px rgba(0,0,0,0.15)"};function U(){return{...W}}function Y(){return{...A}}function j(n="dark",e={}){return{...n==="light"?Y():U(),...e}}function G(n,e){if(!(!n||!n.style)){for(let[a,t]of Object.entries(e))n.style.setProperty(a,t);n.setAttribute("data-hw-theme",e["--hw-bg"]==="#f5f5f5"?"light":"dark")}}function O(n,e,a={}){let t=j(e,a);return G(n,t),t}var f=class{constructor(e){this._hass=e,this._id=0,this._pending=new Map,this._subs=new Map,this._connected=!1,this._hass&&this._hass.connection&&(this._conn=this._hass.connection,this._connected=!0)}async call(e){if(!this._conn)throw new Error("WS connection not available");let a=++this._id;return new Promise((t,r)=>{this._pending.set(a,{resolve:t,reject:r}),this._conn.subscribeMessage(s=>this._handleResponse(a,s),{...e,id:a})})}_handleResponse(e,a){var r;let t=this._pending.get(e);t&&(this._pending.delete(e),a.success===!1?t.reject(new Error(((r=a.error)==null?void 0:r.message)||"WS error")):t.resolve(a.result))}async subscribe(e,a){if(!this._conn)return()=>{};let t=++this._id,r=await this._conn.subscribeMessage(a,{type:e,id:t});return this._subs.set(t,r),r}async command(e,a={}){return this.call({type:`home_weather/${e}`,...a})}async getConfig(){return this.command("get_config")}async setConfig(e){return this.command("set_config",{config:e})}async getWeather(){return this.command("get_weather")}async getHurricanes(){return this.command("get_hurricanes")}async getTornadoes(){return this.command("get_tornadoes")}async getEarthquakes(){return this.command("get_earthquakes")}async getLightning(){return this.command("get_lightning")}async getVolcanoes(){return this.command("get_volcanoes")}async getWildfires(){return this.command("get_wildfires")}async getAirQuality(){return this.command("get_air_quality")}async getTravelAdvisories(){return this.command("get_travel_advisories")}async getSpaceMap(){return this.command("get_space_map")}async getSolarWeather(){return this.command("get_solar_weather")}async getVersion(){return this.command("get_version")}isConnected(){return this._connected}};function R(n,e=200){let a=null,t=(...r)=>{a&&clearTimeout(a),a=setTimeout(()=>{a=null,n(...r)},e)};return t.cancel=()=>{a&&clearTimeout(a),a=null},t}function q(n,e){let a=window.matchMedia(n);e(a.matches);let t=r=>e(r.matches);return a.addEventListener("change",t),()=>a.removeEventListener("change",t)}function B(n,e){return n.querySelector(e)}function F(n){if(n)for(;n.firstChild;)n.removeChild(n.firstChild)}var g=class{constructor({data:e}){this._data=e}render(){var h,d,p,u,H,D;let e=document.createElement("div");e.className="atmosphere-card";let t=(this._data||{}).current||{},r=(h=t.temperature)!=null?h:"--",s=t.condition||"Unknown",i=(d=t.apparent_temperature)!=null?d:"--",o=(p=t.wind_speed)!=null?p:"--",c=(u=t.wind_bearing)!=null?u:"",l=(H=t.humidity)!=null?H:"--",m=(D=t.uv_index)!=null?D:"--";return e.innerHTML=`
      <div class="atmosphere-temp">${r}\xB0</div>
      <div class="atmosphere-condition">${s}</div>
      <div class="atmosphere-stats">
        <div class="stat-item">
          <span class="stat-label">Feels like</span>
          <span class="stat-value">${i}\xB0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Wind</span>
          <span class="stat-value">${o} mph ${c}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Humidity</span>
          <span class="stat-value">${l}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">UV Index</span>
          <span class="stat-value">${m}</span>
        </div>
      </div>
    `,e}};var w=class{constructor({data:e}){this._data=e,this._view="7day"}render(){let e=document.createElement("div");e.className="card forecast-card";let a=this._data||{},t=a.daily||[],r=a.hourly||[],s=document.createElement("div");s.className="forecast-card-header",s.innerHTML='<h3 style="margin:0;font-size:var(--fs-lg)">Forecast</h3>';let i=document.createElement("div");i.className="forecast-toggle";let o=document.createElement("button");o.className="forecast-toggle-btn is-active",o.textContent="7-Day";let c=document.createElement("button");c.className="forecast-toggle-btn",c.textContent="24h",i.appendChild(o),i.appendChild(c),s.appendChild(i),e.appendChild(s);let l=document.createElement("div");l.className="forecast-list-container";let m=()=>{l.innerHTML="";let h=document.createElement("div");h.className="forecast-list",this._view==="7day"?t.forEach((d,p)=>{let u=document.createElement("div");u.className="forecast-row",u.innerHTML=`
            <span class="forecast-day">${p===0?"Today":d.datetime?new Date(d.datetime).toLocaleDateString("en",{weekday:"short"}):""}</span>
            <span class="forecast-icon">${this._getIcon(d.condition)}</span>
            <span class="forecast-condition">${d.condition||""}</span>
            <span class="forecast-temp">${d.temperature!==void 0?Math.round(d.temperature)+"\xB0":"--"}</span>
          `,h.appendChild(u)}):r.slice(0,24).forEach(d=>{let p=document.createElement("div");p.className="forecast-row",p.innerHTML=`
            <span class="forecast-day">${d.datetime?new Date(d.datetime).toLocaleTimeString("en",{hour:"numeric"}):""}</span>
            <span class="forecast-icon">${this._getIcon(d.condition)}</span>
            <span class="forecast-condition">${d.condition||""}</span>
            <span class="forecast-temp">${d.temperature!==void 0?Math.round(d.temperature)+"\xB0":"--"}</span>
          `,h.appendChild(p)}),l.appendChild(h)};return o.addEventListener("click",()=>{this._view="7day",o.classList.add("is-active"),c.classList.remove("is-active"),m()}),c.addEventListener("click",()=>{this._view="24h",c.classList.add("is-active"),o.classList.remove("is-active"),m()}),m(),e.appendChild(l),e}_getIcon(e){let a={"clear-night":"\u{1F319}",cloudy:"\u2601\uFE0F",fog:"\u{1F32B}\uFE0F",hail:"\u{1F328}\uFE0F",lightning:"\u26A1","lightning-rainy":"\u26C8\uFE0F",partlycloudy:"\u26C5",pouring:"\u{1F327}\uFE0F",rainy:"\u{1F327}\uFE0F",snowy:"\u2744\uFE0F","snowy-rainy":"\u{1F328}\uFE0F",sunny:"\u2600\uFE0F",windy:"\u{1F4A8}","windy-variant":"\u{1F4A8}"};return a[e]||a.partlycloudy}};var b=class{constructor({config:e}){this._config=e||{}}render(){let e=document.createElement("div");e.className="card radar-card";let a=this._config.weather_entity_lat||40.7,t=this._config.weather_entity_lon||-74;return e.innerHTML=`
      <h3 style="margin:0 0 var(--space-3);font-size:var(--fs-lg)">Radar</h3>
      <div style="position:relative;width:100%;height:400px;border-radius:var(--radius-md);overflow:hidden">
        <iframe
          src="https://embed.windy.com/embed2.html?lat=${a}&lon=${t}&detailLat=${a}&detailLon=${t}&zoom=6&level=surface&overlay=wind&menu=&message=true&marker=&calendar=&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
          style="width:100%;height:100%;border:0"
          loading="lazy"
          title="Windy.com radar">
        </iframe>
      </div>
    `,e}};var X=["New Moon","Waxing Crescent","First Quarter","Waxing Gibbous","Full Moon","Waning Gibbous","Last Quarter","Waning Crescent"];function x(n){let e=n instanceof Date?n:new Date(n),a=e.getHours(),t=e.getMinutes().toString().padStart(2,"0"),r=a>=12?"PM":"AM";return a=a%12||12,`${a}:${t} ${r}`}function P(n=new Date){let e=n.getFullYear(),a=n.getMonth()+1,t=n.getDate(),r=0,s=0,i=0,o=0;a<3?(r=e-1,s=a+12):(r=e,s=a),i=Math.floor(365.25*(r+4716))+Math.floor(30.6001*(s+1))+t-1524.5,o=(i-24515501e-1)/29.530588853,o=o-Math.floor(o),o<0&&(o+=1);let c=Math.floor(o*8);return X[c%8]}var y=class{constructor({data:e}){this._data=e}render(){let e=document.createElement("div");e.className="card moon-sun-card";let t=(this._data||{}).sun||{},r=P();return e.innerHTML=`
      <h3 style="margin:0 0 var(--space-3);font-size:var(--fs-lg)">Moon & Sun</h3>
      <div class="moon-sun-grid">
        <div class="moon-phase-display">
          <svg class="moon-phase-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#e0e0e0" />
            <ellipse cx="50" cy="50" rx="35" ry="45" fill="#1a1a1a" opacity="0.85" />
          </svg>
          <div>
            <div style="font-weight:600;color:var(--hw-text)">${r}</div>
            <div style="font-size:var(--fs-sm);color:var(--hw-muted)">Current phase</div>
          </div>
        </div>
        <div class="sun-info">
          <div class="sun-info-row">
            <span class="text-muted">Sunrise</span>
            <span style="font-weight:600">${t.sunrise?x(t.sunrise):"--"}</span>
          </div>
          <div class="sun-info-row">
            <span class="text-muted">Sunset</span>
            <span style="font-weight:600">${t.sunset?x(t.sunset):"--"}</span>
          </div>
          <div class="sun-info-row">
            <span class="text-muted">Day Length</span>
            <span style="font-weight:600">${t.day_length||"--"}</span>
          </div>
          <div class="sun-info-row">
            <span class="text-muted">Solar Noon</span>
            <span style="font-weight:600">${t.solar_noon?x(t.solar_noon):"--"}</span>
          </div>
        </div>
      </div>
    `,e}};var _=class{constructor({data:e}){this._data=e}render(){let e=document.createElement("div");e.className="card nws-alerts-card";let t=(this._data||{}).alerts||[],r=document.createElement("h3");if(r.style.cssText="margin:0 0 var(--space-3);font-size:var(--fs-lg)",r.textContent="NWS Alerts",e.appendChild(r),t.length===0){let i=document.createElement("div");return i.className="alerts-empty",i.innerHTML="<p>No active alerts for your area</p>",e.appendChild(i),e}let s=document.createElement("div");return s.className="alerts-list",t.forEach(i=>{let o=document.createElement("div");o.className=`alert-item ${i.severity||"minor"}`,o.innerHTML=`
        <div class="alert-headline">${i.headline||i.event||"Weather Alert"}</div>
        <div class="alert-meta">${i.severity||""} \xB7 ${i.urgency||""}</div>
      `,s.appendChild(o)}),e.appendChild(s),e}};var k=class{constructor({data:e}){this._data=e}render(){let e=document.createElement("div");e.className="card hurricane-card";let a=this._data||{},t=a.summary||{},r=a.storms||[],s=t.threatLevel||"none",i=t.closestStormName?`${t.closestStormName}`:"No storms",o=t.distanceToCenterMiles!==null?`${Math.round(t.distanceToCenterMiles)} mi`:"";return e.innerHTML=`
      <h3 style="margin:0 0 var(--space-3);font-size:var(--fs-lg)">Hurricane Tracker</h3>
      <div style="margin-bottom:var(--space-3)">
        <span class="hurricane-threat-badge threat-${s}">${s}</span>
        <span style="margin-left:var(--space-2);color:var(--hw-muted)">${r.length} active storms</span>
      </div>
      <div class="flex-between" style="margin-bottom:var(--space-2)">
        <span class="text-muted">Closest Storm</span>
        <span style="font-weight:600">${i} ${o}</span>
      </div>
      ${t.insideCone?'<div style="color:var(--hw-warning);font-weight:600;margin-top:var(--space-2)">\u26A0 Your home is inside the forecast cone</div>':""}
    `,e}};var C=class{constructor({data:e}){this._data=e}render(){var t,r,s;let e=document.createElement("div");e.className="card space-card";let a=this._data||{};return e.innerHTML=`
      <h3 style="margin:0 0 var(--space-3);font-size:var(--fs-lg)">Space Weather</h3>
      <div class="space-card-content">
        <div class="space-card-title">Solar Activity</div>
        <div class="text-muted" style="font-size:var(--fs-sm)">
          ${a.solar_activity||"No significant activity"}
        </div>
        <div style="margin-top:var(--space-3);display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-2);text-align:center">
          <div>
            <div style="font-size:var(--fs-sm);color:var(--hw-muted)">K-Index</div>
            <div style="font-weight:600">${(t=a.k_index)!=null?t:"--"}</div>
          </div>
          <div>
            <div style="font-size:var(--fs-sm);color:var(--hw-muted)">Sunspots</div>
            <div style="font-weight:600">${(r=a.sunspot_count)!=null?r:"--"}</div>
          </div>
          <div>
            <div style="font-size:var(--fs-sm);color:var(--hw-muted)">Flares</div>
            <div style="font-weight:600">${(s=a.flare_count)!=null?s:"--"}</div>
          </div>
        </div>
      </div>
    `,e}};var E=class{constructor({panel:e,ws:a,root:t}){this._panel=e,this._ws=a,this._root=t,this._layout=null,this._weatherData=null,this._hurricaneData=null,this._spaceData=null,this._defaultCards=[{id:"atmosphere",type:"atmosphere",size:"full"},{id:"forecast",type:"forecast",size:"full"},{id:"radar",type:"radar",size:"full"},{id:"moonsun",type:"moonsun",size:"half"},{id:"nwsalerts",type:"nwsalerts",size:"half"},{id:"hurricane",type:"hurricane",size:"half"},{id:"space",type:"space",size:"half"}]}async _loadData(){if(this._ws)try{let[e,a,t]=await Promise.allSettled([this._ws.getWeather(),this._ws.getHurricanes(),this._ws.getSpaceMap()]);e.status==="fulfilled"&&(this._weatherData=e.value),a.status==="fulfilled"&&(this._hurricaneData=a.value),t.status==="fulfilled"&&(this._spaceData=t.value)}catch(e){console.warn("Dashboard data load error:",e)}}_getCards(){let e=this._panel._dashboardLayout;return e&&e.length>0?e:this._defaultCards}render(){let e=document.createElement("div");if(e.className="dashboard-view",this._panel._editMode){let r=document.createElement("div");r.className="dashboard-edit-bar",r.innerHTML=`
        <span class="text-accent" style="font-weight:600">Customize Mode</span>
        <div class="flex gap-2">
          <button class="btn btn-ghost" id="reset-layout">Reset to Default</button>
          <button class="btn btn-ghost" id="cancel-edit">Cancel</button>
          <button class="btn btn-primary" id="save-layout">Save Layout</button>
        </div>
      `,e.appendChild(r)}else{let r=document.createElement("button");r.className="btn btn-ghost",r.innerHTML="Customize",r.style.marginBottom="var(--space-3)",r.addEventListener("click",()=>{this._panel._editMode=!0,this._panel._scheduleRender()}),e.appendChild(r)}let a=document.createElement("div");a.className="dashboard-grid";let t=this._getCards();for(let r of t){let s=this._renderCard(r);s&&a.appendChild(s)}if(e.appendChild(a),this._panel._editMode){let r=e.querySelector("#reset-layout"),s=e.querySelector("#cancel-edit"),i=e.querySelector("#save-layout");r&&r.addEventListener("click",()=>this._resetLayout()),s&&s.addEventListener("click",()=>this._cancelEdit()),i&&i.addEventListener("click",()=>this._saveLayout())}return e}_renderCard(e){let a=document.createElement("div");if(a.className=`card-slot card-${e.size||"full"}`,a.dataset.cardId=e.id,this._panel._editMode){let r=document.createElement("div");r.className="card-slot-controls",r.innerHTML=`
        <button class="card-slot-btn" data-action="remove" title="Remove">&times;</button>
        <button class="card-slot-btn" data-action="settings" title="Settings">*</button>
      `,a.appendChild(r)}let t=document.createElement("div");switch(t.className="card-content",e.type){case"atmosphere":{let r=new g({data:this._weatherData});t.appendChild(r.render());break}case"forecast":{let r=new w({data:this._weatherData});t.appendChild(r.render());break}case"radar":{let r=new b({config:this._panel._config});t.appendChild(r.render());break}case"moonsun":{let r=new y({data:this._weatherData});t.appendChild(r.render());break}case"nwsalerts":{let r=new _({data:this._weatherData});t.appendChild(r.render());break}case"hurricane":{let r=new k({data:this._hurricaneData});t.appendChild(r.render());break}case"space":{let r=new C({data:this._spaceData});t.appendChild(r.render());break}default:t.innerHTML=`<p class="text-muted">Unknown card: ${e.type}</p>`}return a.appendChild(t),a}_resetLayout(){this._panel._dashboardLayout=null,this._panel._editMode=!1,this._panel._scheduleRender()}_cancelEdit(){this._panel._editMode=!1,this._panel._scheduleRender()}_saveLayout(){this._panel._editMode=!1,this._panel._scheduleRender()}};var S=class{constructor({panel:e,ws:a,root:t}){this._panel=e,this._ws=a,this._root=t,this._tracker=null,this._mapInitialized=!1}async _ensureMap(){if(!this._mapInitialized){if(!document.querySelector('link[href*="leaflet"]')){let e=document.createElement("link");e.rel="stylesheet",e.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",document.head.appendChild(e)}window.L||await new Promise((e,a)=>{let t=document.createElement("script");t.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",t.onload=e,t.onerror=a,document.head.appendChild(t)}),window.HurricaneTracker||await new Promise((e,a)=>{let t=document.createElement("script");t.src="/local/home_weather/hurricane-tracker.js",t.onload=e,t.onerror=a,document.head.appendChild(t)}),this._mapInitialized=!0}}async _initMap(e){await this._ensureMap();let a=e.querySelector("#hazard-map");if(!(!a||!window.HurricaneTracker)){if(this._tracker){this._tracker.refresh();return}this._tracker=new window.HurricaneTracker({hass:this._panel.hass,shadowRoot:this._panel.shadowRoot}),await this._tracker.init(a)}}async render(){let e=document.createElement("div");return e.className="hurricanes-view",e.innerHTML=`
      <div id="hazard-map" style="width:100%;height:calc(100vh - 120px);min-height:500px;border-radius:var(--radius-lg);overflow:hidden"></div>
    `,setTimeout(()=>this._initMap(e),0),e}};var T=class{constructor({panel:e,ws:a,root:t}){this._panel=e,this._ws=a,this._root=t,this._initialized=!1}async _ensureDeps(){this._initialized||(window.THREE||await new Promise((e,a)=>{let t=document.createElement("script");t.src="/local/home_weather/three.min.js",t.onload=e,t.onerror=a,document.head.appendChild(t)}),window.SpaceMap||await new Promise((e,a)=>{let t=document.createElement("script");t.src="/local/home_weather/space-map.js",t.onload=e,t.onerror=a,document.head.appendChild(t)}),this._initialized=!0)}async _initMap(e){await this._ensureDeps();let a=e.querySelector("#space-canvas-wrap");if(!a||!window.SpaceMap)return;let t=new window.SpaceMap({root:a});t.init&&await t.init()}async render(){let e=document.createElement("div");return e.className="space-view",e.innerHTML=`
      <div id="space-canvas-wrap" style="width:100%;height:calc(100vh - 120px);min-height:500px;border-radius:var(--radius-lg);overflow:hidden"></div>
    `,setTimeout(()=>this._initMap(e),0),e}};var N=class{constructor({panel:e,ws:a,root:t}){this._panel=e,this._ws=a,this._root=t,this._alerts=[]}async _loadData(){if(this._ws)try{let e=await this._ws.getWeather();this._alerts=(e==null?void 0:e.alerts)||[]}catch(e){console.warn("Failed to load alerts:",e)}}async render(){await this._loadData();let e=document.createElement("div");e.className="alerts-view";let a=document.createElement("h2");if(a.style.cssText="margin:0 0 var(--space-4)",a.textContent="Weather Alerts",e.appendChild(a),this._alerts.length===0){let r=document.createElement("div");return r.className="card",r.innerHTML='<p class="text-muted" style="text-align:center;padding:var(--space-6)">No active alerts for your area</p>',e.appendChild(r),e}let t=document.createElement("div");return t.className="alerts-list",this._alerts.forEach(r=>{let s=document.createElement("div");s.className=`card alert-item ${r.severity||"minor"}`,s.style.marginBottom="var(--space-2)",s.innerHTML=`
        <div class="alert-headline">${r.headline||r.event||"Weather Alert"}</div>
        <div class="alert-meta">${r.severity||""} \xB7 ${r.urgency||""}</div>
        <div style="margin-top:var(--space-2);font-size:var(--fs-body);color:var(--hw-text)">
          ${(r.description||"").slice(0,200)}${(r.description||"").length>200?"...":""}
        </div>
      `,t.appendChild(s)}),e.appendChild(t),e}};var M=class{constructor({panel:e,ws:a,root:t}){this._panel=e,this._ws=a,this._root=t,this._chart=null}async _ensureCharts(){window.ApexCharts||await new Promise((e,a)=>{let t=document.createElement("script");t.src="https://cdn.jsdelivr.net/npm/apexcharts",t.onload=e,t.onerror=a,document.head.appendChild(t)})}async _loadData(){if(!this._ws)return null;try{let e=await this._ws.getWeather();return(e==null?void 0:e.hourly)||[]}catch(e){return console.warn("Failed to load trends data:",e),[]}}async render(){var s;let e=document.createElement("div");e.className="trends-view";let a=document.createElement("h2");a.style.cssText="margin:0 0 var(--space-4)",a.textContent="Trends",e.appendChild(a);let t=document.createElement("div");t.className="card",t.innerHTML='<div id="trends-chart" style="min-height:350px"></div>',e.appendChild(t);let r=await this._loadData();try{await this._ensureCharts();let i=r.slice(0,24).map((c,l)=>({x:l,y:c.temperature!=null?Math.round(c.temperature):null})),o=new window.ApexCharts(t.querySelector("#trends-chart"),{series:[{name:"Temperature",data:i}],chart:{type:"area",height:350,background:"transparent",toolbar:{show:!1}},theme:{mode:((s=this._panel._appearance)==null?void 0:s.mode)==="light"?"light":"dark"},colors:["#03a9f4"],fill:{type:"gradient",gradient:{opacityFrom:.4,opacityTo:.05}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:2},xaxis:{categories:r.slice(0,24).map((c,l)=>`${l}h`),labels:{style:{colors:"#9b9b9b"}}},yaxis:{labels:{formatter:c=>c+"\xB0",style:{colors:"#9b9b9b"}}}});o.render(),this._chart=o}catch(i){t.innerHTML='<p class="text-muted" style="text-align:center;padding:var(--space-6)">Chart failed to load</p>'}return e}};var L=class{constructor({panel:e,ws:a,root:t}){this._panel=e,this._ws=a,this._root=t,this._pane="general-weather-source"}render(){let e=document.createElement("div");e.className="settings-view flex",e.style.maxWidth="1000px",e.style.margin="0 auto",e.style.gap="var(--space-4)";let a=document.createElement("div");a.className="settings-sidebar",a.innerHTML=`
      <div class="settings-sidebar-group">General</div>
      <div class="settings-sidebar-item is-active" data-pane="general-weather-source">Weather Source</div>
      <div class="settings-sidebar-item" data-pane="general-about">About</div>
      <div class="settings-sidebar-group">Monitoring</div>
      <div class="settings-sidebar-item" data-pane="monitoring-tornado">Tornado</div>
      <div class="settings-sidebar-item" data-pane="monitoring-earthquake">Earthquake</div>
      <div class="settings-sidebar-item" data-pane="monitoring-lightning">Lightning</div>
      <div class="settings-sidebar-item" data-pane="monitoring-volcano">Volcano</div>
      <div class="settings-sidebar-item" data-pane="monitoring-wildfire">Wildfire</div>
      <div class="settings-sidebar-item" data-pane="monitoring-air_quality">Air Quality</div>
      <div class="settings-sidebar-group">Appearance</div>
      <div class="settings-sidebar-item" data-pane="appearance-overview">Overview</div>
      <div class="settings-sidebar-item" data-pane="appearance-theme">Theme</div>
      <div class="settings-sidebar-item" data-pane="appearance-colors">Colors</div>
    `;let t=document.createElement("div");t.className="flex-1 p-4";let r=document.createElement("h2");r.style.cssText="margin:0 0 var(--space-4)",r.textContent="Settings",t.appendChild(r);let s=document.createElement("div");return s.className="settings-content",s.innerHTML=this._renderPaneContent(this._pane),t.appendChild(s),e.appendChild(a),e.appendChild(t),a.querySelectorAll(".settings-sidebar-item").forEach(i=>{i.addEventListener("click",()=>{a.querySelectorAll(".settings-sidebar-item").forEach(o=>o.classList.remove("is-active")),i.classList.add("is-active"),this._pane=i.dataset.pane,s.innerHTML=this._renderPaneContent(this._pane)})}),e}_renderPaneContent(e){switch(e){case"general-weather-source":return`
          <div class="card">
            <h3 style="margin:0 0 var(--space-3)">Weather Source</h3>
            <p class="text-muted">Select a weather entity with daily and hourly forecasts.</p>
            <select class="select w-full" id="weather-entity-select">
              <option value="">Select entity...</option>
            </select>
            <button class="btn btn-primary" style="margin-top:var(--space-3)">Save Weather Entity</button>
          </div>
        `;case"general-about":return`
          <div class="card">
            <h3 style="margin:0 0 var(--space-3)">About Home Weather</h3>
            <p class="text-muted">Version ${this._panel._version||"2.0.0"}</p>
            <p>A Home Assistant custom integration with full-screen weather panel, animated conditions, NWS alerts, hurricane tracking, and configurable TTS.</p>
          </div>
        `;case"appearance-theme":return`
          <div class="card">
            <h3 style="margin:0 0 var(--space-3)">Theme</h3>
            <div style="display:flex;gap:var(--space-2)">
              <button class="btn btn-primary" data-theme="dark">Dark</button>
              <button class="btn btn-ghost" data-theme="light">Light</button>
            </div>
          </div>
        `;case"appearance-colors":return`
          <div class="card">
            <h3 style="margin:0 0 var(--space-3)">Color Overrides</h3>
            <p class="text-muted">Customize individual theme colors.</p>
            <div style="display:grid;gap:var(--space-2);margin-top:var(--space-3)">
              <div class="flex-between"><span>Accent</span><input type="color" value="#03a9f4" style="width:40px;height:30px"></div>
              <div class="flex-between"><span>Background</span><input type="color" value="#111111" style="width:40px;height:30px"></div>
              <div class="flex-between"><span>Surface</span><input type="color" value="#1c1c1c" style="width:40px;height:30px"></div>
            </div>
          </div>
        `;default:return`<div class="card"><h3 style="margin:0">${e.replace(/-/g," ").replace(/^\w/,a=>a.toUpperCase())}</h3><p class="text-muted">Settings for ${e.replace(/-/g," ")}.</p></div>`}}};var z=class{constructor({panel:e,currentView:a,isNarrow:t,onNavigate:r}){this._panel=e,this._currentView=a,this._isNarrow=t,this._onNavigate=r}render(){let e=document.createElement("div");e.className="app-bar";let a=document.createElement("div");a.className="app-bar-brand",a.innerHTML='<span class="accent">Home</span> Weather',e.appendChild(a);let t=document.createElement("nav");t.className="app-bar-nav";let r=[{id:"forecast",label:"Forecast",icon:"\u2601"},{id:"hurricanes",label:"Hurricanes",icon:"\u{1F300}"},{id:"space",label:"Space",icon:"\u{1F680}"},{id:"alerts",label:"Alerts",icon:"\u26A0"},{id:"trends",label:"Trends",icon:"\u{1F4CA}"}];for(let o of r){let c=document.createElement("button");c.className="app-bar-nav-btn"+(o.id===this._currentView?" is-active":""),c.innerHTML=`${o.icon} ${o.label}`,c.addEventListener("click",()=>this._onNavigate(o.id)),t.appendChild(c)}e.appendChild(t);let s=document.createElement("div");s.className="app-bar-actions";let i=document.createElement("button");return i.className="btn btn-icon btn-ghost",i.innerHTML="\u2699",i.title="Settings",i.addEventListener("click",()=>this._onNavigate("settings")),s.appendChild(i),e.appendChild(s),e}};var $=class{constructor({panel:e}){this._panel=e,this._isOpen=!1,this._content=null}get isOpen(){return this._isOpen}open(e){this._content=e,this._isOpen=!0,this._render()}close(){this._isOpen=!1,this._content=null,this._render()}_render(){if(this._el&&this._el.remove(),!this._isOpen)return;let e=document.createElement("div");e.className="detail-sheet-backdrop is-open";let a=document.createElement("div");a.className="detail-sheet";let t=document.createElement("div");t.className="detail-sheet-handle",a.appendChild(t);let r=document.createElement("button");r.className="btn btn-icon btn-ghost",r.innerHTML="\xD7",r.style.cssText="position:absolute;top:var(--space-3);right:var(--space-3)",r.addEventListener("click",()=>this.close()),a.appendChild(r);let s=document.createElement("div");s.className="detail-sheet-content",typeof this._content=="string"?s.innerHTML=this._content:this._content instanceof Node&&s.appendChild(this._content),a.appendChild(s),e.appendChild(a),e.addEventListener("click",i=>{i.target===e&&this.close()}),this._el=e}renderEl(){return this._isOpen&&this._el?this._el:document.createElement("div")}render(){return this._isOpen&&this._el?this._el:document.createElement("div")}};var I=`/* Global base styles for Home Weather panel */\r
:host {\r
  /* Default to dark */\r
  --hw-bg: #111111;\r
  --hw-surface: #1c1c1c;\r
  --hw-surface-2: #161616;\r
  --hw-elevated: #282828;\r
  --hw-input-bg: #282828;\r
  --hw-text: #e1e1e1;\r
  --hw-muted: #9b9b9b;\r
  --hw-disabled: #6f6f6f;\r
  --hw-accent: #03a9f4;\r
  --hw-accent-hover: #29b6f6;\r
  --hw-accent-dim: rgba(3, 169, 244, 0.15);\r
  --hw-danger: #f44336;\r
  --hw-warning: #ff9800;\r
  --hw-success: #4caf50;\r
  --hw-border: #252525;\r
  --hw-border-strong: #333333;\r
  --hw-hover: #222222;\r
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);\r
  --shadow: 0 4px 6px rgba(0,0,0,0.4);\r
  --shadow-md: 0 8px 16px rgba(0,0,0,0.5);\r
  --shadow-lg: 0 16px 32px rgba(0,0,0,0.6);\r
  --radius-sm: 6px;\r
  --radius-md: 10px;\r
  --radius-lg: 16px;\r
  --radius-xl: 20px;\r
  --radius-full: 9999px;\r
  --space-1: 4px;\r
  --space-2: 8px;\r
  --space-3: 12px;\r
  --space-4: 16px;\r
  --space-5: 24px;\r
  --space-6: 32px;\r
  --fs-xs: 11px;\r
  --fs-sm: 12px;\r
  --fs-body: 14px;\r
  --fs-md: 16px;\r
  --fs-lg: 20px;\r
  --fs-xl: 28px;\r
  --fs-2xl: 36px;\r
  --fs-hero: clamp(64px, 18vw, 104px);\r
  --ease: cubic-bezier(0.4, 0, 0.2, 1);\r
  --ease-in: cubic-bezier(0.4, 0, 1, 1);\r
  --ease-out: cubic-bezier(0, 0, 0.2, 1);\r
  --dur-fast: 150ms;\r
  --dur-normal: 250ms;\r
  --dur-slow: 400ms;\r
  --primary-background-color: var(--hw-bg);\r
  --card-background-color: var(--hw-surface);\r
  --panel-header-background: var(--hw-surface);\r
  --secondary-background-color: var(--hw-elevated);\r
  --input-bg: var(--hw-input-bg);\r
  --primary-text-color: var(--hw-text);\r
  --secondary-text-color: var(--hw-muted);\r
  --panel-accent: var(--hw-accent);\r
  --panel-danger: var(--hw-danger);\r
  --panel-warning: var(--hw-warning);\r
  --panel-success: var(--hw-success);\r
}\r
\r
:host([data-hw-theme="light"]) {\r
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.08);\r
  --shadow: 0 4px 6px rgba(0,0,0,0.1);\r
  --shadow-md: 0 8px 16px rgba(0,0,0,0.12);\r
  --shadow-lg: 0 16px 32px rgba(0,0,0,0.15);\r
}\r
\r
* { box-sizing: border-box; }\r
a { color: var(--hw-accent); text-decoration: none; }\r
a:hover { color: var(--hw-accent-hover); }\r
\r
/* Utility classes */\r
.flex { display: flex; flex-direction: row; }\r
.flex-col { display: flex; flex-direction: column; }\r
.flex-center { display: flex; align-items: center; justify-content: center; }\r
.flex-between { display: flex; align-items: center; justify-content: space-between; }\r
.grid { display: grid; }\r
.gap-1 { gap: var(--space-1); }\r
.gap-2 { gap: var(--space-2); }\r
.gap-3 { gap: var(--space-3); }\r
.gap-4 { gap: var(--space-4); }\r
.gap-5 { gap: var(--space-5); }\r
.gap-6 { gap: var(--space-6); }\r
.w-full { width: 100%; }\r
.h-full { height: 100%; }\r
.p-1 { padding: var(--space-1); }\r
.p-2 { padding: var(--space-2); }\r
.p-3 { padding: var(--space-3); }\r
.p-4 { padding: var(--space-4); }\r
.p-5 { padding: var(--space-5); }\r
.p-6 { padding: var(--space-6); }\r
.rounded { border-radius: var(--radius-md); }\r
.rounded-lg { border-radius: var(--radius-lg); }\r
.rounded-full { border-radius: var(--radius-full); }\r
.text-sm { font-size: var(--fs-sm); }\r
.text-base { font-size: var(--fs-body); }\r
.text-lg { font-size: var(--fs-lg); }\r
.text-xl { font-size: var(--fs-xl); }\r
.text-muted { color: var(--hw-muted); }\r
.text-accent { color: var(--hw-accent); }\r
.text-danger { color: var(--hw-danger); }\r
.text-warning { color: var(--hw-warning); }\r
.text-success { color: var(--hw-success); }\r
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0; }\r
\r
/* Card styles */\r
.card {\r
  background: var(--card-background-color);\r
  border-radius: var(--radius-lg);\r
  padding: var(--space-4);\r
  box-shadow: var(--shadow-sm);\r
  border: 1px solid var(--hw-border);\r
}\r
\r
/* Buttons */\r
.btn {\r
  display: inline-flex;\r
  align-items: center;\r
  justify-content: center;\r
  gap: var(--space-2);\r
  padding: var(--space-2) var(--space-4);\r
  height: 36px;\r
  border: 1px solid transparent;\r
  border-radius: var(--radius-md);\r
  background: var(--hw-elevated);\r
  color: var(--hw-text);\r
  font-size: var(--fs-body);\r
  font-weight: 500;\r
  cursor: pointer;\r
  transition: background var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease);\r
  white-space: nowrap;\r
}\r
.btn:hover { background: var(--hw-hover); }\r
.btn:active { transform: scale(0.97); }\r
.btn:focus-visible { outline: 2px solid var(--hw-accent); outline-offset: 2px; }\r
.btn-primary { background: var(--hw-accent); color: #fff; }\r
.btn-primary:hover { background: var(--hw-accent-hover); }\r
.btn-danger { background: var(--hw-danger); color: #fff; }\r
.btn-success { background: var(--hw-success); color: #fff; }\r
.btn-ghost { background: transparent; }\r
.btn-icon { padding: var(--space-2); width: 36px; }\r
.btn:disabled { opacity: 0.5; cursor: not-allowed; }\r
\r
/* Form inputs */\r
.input, .select {\r
  height: 36px;\r
  padding: 0 var(--space-3);\r
  border: 1px solid var(--hw-border);\r
  border-radius: var(--radius-md);\r
  background: var(--input-bg);\r
  color: var(--hw-text);\r
  font-size: var(--fs-body);\r
  transition: border-color var(--dur-fast) var(--ease);\r
}\r
.input:focus, .select:focus {\r
  outline: none;\r
  border-color: var(--hw-accent);\r
}\r
\r
/* Skeleton loading */\r
.skeleton {\r
  background: linear-gradient(90deg, var(--hw-surface-2) 25%, var(--hw-elevated) 50%, var(--hw-surface-2) 75%);\r
  background-size: 200% 100%;\r
  animation: shimmer 1.5s infinite;\r
  border-radius: var(--radius-sm);\r
}\r
@keyframes shimmer {\r
  0% { background-position: 200% 0; }\r
  100% { background-position: -200% 0; }\r
}\r
\r
/* Toast */\r
.toast-container {\r
  position: fixed;\r
  top: var(--space-4);\r
  right: var(--space-4);\r
  z-index: 9999;\r
  display: flex;\r
  flex-direction: column;\r
  gap: var(--space-2);\r
  pointer-events: none;\r
}\r
.toast {\r
  pointer-events: auto;\r
  background: var(--hw-elevated);\r
  border: 1px solid var(--hw-border);\r
  border-left: 3px solid var(--hw-accent);\r
  border-radius: var(--radius-md);\r
  padding: var(--space-3) var(--space-4);\r
  box-shadow: var(--shadow-md);\r
  font-size: var(--fs-body);\r
  max-width: 320px;\r
  animation: slideIn var(--dur-normal) var(--ease);\r
}\r
.toast.error { border-left-color: var(--hw-danger); }\r
.toast.success { border-left-color: var(--hw-success); }\r
.toast.warning { border-left-color: var(--hw-warning); }\r
@keyframes slideIn {\r
  from { transform: translateX(100%); opacity: 0; }\r
  to { transform: translateX(0); opacity: 1; }\r
}\r
`;var V=`/* Responsive layout utilities */\r
\r
/* Container */\r
.container {\r
  width: 100%;\r
  max-width: 1600px;\r
  margin: 0 auto;\r
  padding: 0 var(--space-4);\r
}\r
\r
/* Content area safe-area insets */\r
.content-area {\r
  padding: clamp(var(--space-3), 3vw, var(--space-5));\r
  padding-top: calc(env(safe-area-inset-top, 0px) + var(--space-4));\r
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + var(--space-4));\r
  padding-left: calc(env(safe-area-inset-left, 0px) + var(--space-4));\r
  padding-right: calc(env(safe-area-inset-right, 0px) + var(--space-4));\r
}\r
\r
/* Mobile-first breakpoints */\r
@media (max-width: 768px) {\r
  .hide-mobile { display: none !important; }\r
  .mobile-stack { flex-direction: column !important; }\r
  .mobile-full { width: 100% !important; }\r
  .mobile-pad { padding: var(--space-3) !important; }\r
  .mobile-scroll {\r
    overflow-x: auto;\r
    -webkit-overflow-scrolling: touch;\r
    scroll-snap-type: x mandatory;\r
  }\r
}\r
\r
@media (max-width: 380px) {\r
  .hide-small { display: none !important; }\r
  .container { padding: 0 var(--space-2); }\r
}\r
\r
@media (min-width: 769px) {\r
  .show-mobile { display: none !important; }\r
}\r
\r
/* Bottom sheet */\r
.bottom-sheet-backdrop {\r
  position: fixed;\r
  top: 0; left: 0; right: 0; bottom: 0;\r
  background: rgba(0,0,0,0.5);\r
  display: flex;\r
  align-items: flex-end;\r
  justify-content: center;\r
  z-index: 100;\r
}\r
.bottom-sheet {\r
  background: var(--hw-surface);\r
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;\r
  padding: var(--space-4);\r
  width: 100%;\r
  max-width: 480px;\r
  max-height: 80vh;\r
  overflow-y: auto;\r
  animation: sheetUp var(--dur-normal) var(--ease-out);\r
  touch-action: pan-y;\r
}\r
@keyframes sheetUp {\r
  from { transform: translateY(100%); }\r
  to { transform: translateY(0); }\r
}\r
.bottom-sheet-handle {\r
  width: 36px;\r
  height: 4px;\r
  background: var(--hw-border-strong);\r
  border-radius: var(--radius-full);\r
  margin: 0 auto var(--space-4);\r
}\r
\r
/* Drawer navigation */\r
.nav-drawer-backdrop {\r
  position: fixed;\r
  inset: 0;\r
  background: rgba(0,0,0,0.5);\r
  z-index: 200;\r
}\r
.nav-drawer {\r
  position: fixed;\r
  top: 0;\r
  left: 0;\r
  bottom: 0;\r
  width: 280px;\r
  max-width: 80vw;\r
  background: var(--hw-surface);\r
  z-index: 201;\r
  box-shadow: var(--shadow-lg);\r
  animation: drawerIn var(--dur-normal) var(--ease-out);\r
  display: flex;\r
  flex-direction: column;\r
}\r
@keyframes drawerIn {\r
  from { transform: translateX(-100%); }\r
  to { transform: translateX(0); }\r
}\r
\r
/* Safe area */\r
@supports (padding: env(safe-area-inset-bottom)) {\r
  .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }\r
  .safe-top { padding-top: env(safe-area-inset-top); }\r
  .safe-left { padding-left: env(safe-area-inset-left); }\r
  .safe-right { padding-right: env(safe-area-inset-right); }\r
}\r
\r
/* Reduced motion */\r
@media (prefers-reduced-motion: reduce) {\r
  *, *::before, *::after {\r
    animation-duration: 0.01ms !important;\r
    animation-iteration-count: 1 !important;\r
    transition-duration: 0.01ms !important;\r
  }\r
  .bottom-sheet, .nav-drawer { animation: none; }\r
}\r
`;var Q=`/* App bar and navigation menu styles */\r
\r
.app-bar {\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  height: 56px;\r
  padding: 0 var(--space-4);\r
  background: var(--hw-surface);\r
  border-bottom: 1px solid var(--hw-border);\r
  gap: var(--space-3);\r
  position: relative;\r
  z-index: 50;\r
}\r
\r
.app-bar-brand {\r
  display: flex;\r
  align-items: center;\r
  gap: var(--space-2);\r
  font-weight: 700;\r
  font-size: var(--fs-lg);\r
  color: var(--hw-text);\r
  white-space: nowrap;\r
}\r
\r
.app-bar-brand .accent {\r
  color: var(--hw-accent);\r
}\r
\r
.app-bar-nav {\r
  display: flex;\r
  align-items: center;\r
  gap: var(--space-1);\r
  flex: 1;\r
  justify-content: center;\r
  overflow-x: auto;\r
  -webkit-overflow-scrolling: touch;\r
}\r
\r
.app-bar-nav-btn {\r
  display: inline-flex;\r
  align-items: center;\r
  gap: var(--space-1);\r
  padding: var(--space-2) var(--space-3);\r
  height: 36px;\r
  border: none;\r
  border-radius: var(--radius-md);\r
  background: transparent;\r
  color: var(--hw-muted);\r
  font-size: var(--fs-sm);\r
  font-weight: 500;\r
  cursor: pointer;\r
  transition: all var(--dur-fast) var(--ease);\r
  white-space: nowrap;\r
  min-width: 44px;\r
  justify-content: center;\r
}\r
\r
.app-bar-nav-btn:hover {\r
  background: var(--hw-hover);\r
  color: var(--hw-text);\r
}\r
\r
.app-bar-nav-btn.is-active {\r
  background: var(--hw-accent-dim);\r
  color: var(--hw-accent);\r
}\r
\r
.app-bar-actions {\r
  display: flex;\r
  align-items: center;\r
  gap: var(--space-2);\r
}\r
\r
/* Hambamburger toggle */\r
.menu-toggle {\r
  display: none;\r
  align-items: center;\r
  justify-content: center;\r
  width: 44px;\r
  height: 44px;\r
  border: none;\r
  border-radius: var(--radius-md);\r
  background: transparent;\r
  color: var(--hw-text);\r
  cursor: pointer;\r
}\r
.menu-toggle:hover { background: var(--hw-hover); }\r
\r
@media (max-width: 768px) {\r
  .menu-toggle { display: flex; }\r
  .app-bar-nav { display: none; }\r
  .app-bar { padding: 0 var(--space-3); }\r
}\r
\r
/* Side navigation (desktop sidebar) */\r
.side-nav {\r
  display: flex;\r
  flex-direction: column;\r
  gap: var(--space-1);\r
  padding: var(--space-4);\r
}\r
\r
.side-nav-item {\r
  display: flex;\r
  align-items: center;\r
  gap: var(--space-2);\r
  padding: var(--space-2) var(--space-3);\r
  height: 40px;\r
  border-radius: var(--radius-md);\r
  color: var(--hw-muted);\r
  font-size: var(--fs-body);\r
  cursor: pointer;\r
  transition: all var(--dur-fast) var(--ease);\r
}\r
.side-nav-item:hover { background: var(--hw-hover); color: var(--hw-text); }\r
.side-nav-item.is-active { background: var(--hw-accent-dim); color: var(--hw-accent); font-weight: 600; }\r
\r
/* Settings sidebar */\r
.settings-sidebar {\r
  width: 240px;\r
  background: var(--hw-surface-2);\r
  border-right: 1px solid var(--hw-border);\r
  display: flex;\r
  flex-direction: column;\r
}\r
\r
.settings-sidebar-group {\r
  padding: var(--space-3) var(--space-4) var(--space-1);\r
  font-size: var(--fs-xs);\r
  font-weight: 600;\r
  color: var(--hw-muted);\r
  text-transform: uppercase;\r
  letter-spacing: 0.05em;\r
}\r
\r
.settings-sidebar-item {\r
  display: flex;\r
  align-items: center;\r
  gap: var(--space-2);\r
  padding: var(--space-2) var(--space-4);\r
  color: var(--hw-text);\r
  font-size: var(--fs-body);\r
  cursor: pointer;\r
  border-left: 3px solid transparent;\r
  margin: 0 var(--space-2);\r
  border-radius: 0 var(--radius-md) var(--radius-md) 0;\r
  transition: all var(--dur-fast) var(--ease);\r
}\r
.settings-sidebar-item:hover { background: var(--hw-hover); }\r
.settings-sidebar-item.is-active {\r
  background: var(--hw-accent-dim);\r
  color: var(--hw-accent);\r
  border-left-color: var(--hw-accent);\r
  font-weight: 600;\r
}\r
\r
@media (max-width: 768px) {\r
  .settings-sidebar {\r
    display: none;\r
    position: fixed;\r
    top: 0;\r
    left: 0;\r
    bottom: 0;\r
    z-index: 300;\r
    box-shadow: var(--shadow-lg);\r
  }\r
  .settings-sidebar.is-open { display: flex; }\r
}\r
\r
/* Accordion */\r
.accordion-group {\r
  border: 1px solid var(--hw-border);\r
  border-radius: var(--radius-md);\r
  margin-bottom: var(--space-2);\r
  overflow: hidden;\r
}\r
.accordion-header {\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  padding: var(--space-3) var(--space-4);\r
  background: var(--hw-surface-2);\r
  cursor: pointer;\r
  font-weight: 600;\r
  user-select: none;\r
  min-height: 44px;\r
}\r
.accordion-header:hover { background: var(--hw-hover); }\r
.accordion-header .accordion-icon {\r
  transition: transform var(--dur-fast) var(--ease);\r
  color: var(--hw-muted);\r
}\r
.accordion-group.is-open .accordion-icon {\r
  transform: rotate(180deg);\r
}\r
.accordion-body {\r
  max-height: 0;\r
  overflow: hidden;\r
  transition: max-height var(--dur-normal) var(--ease);\r
}\r
.accordion-group.is-open .accordion-body {\r
  max-height: 2000px;\r
}\r
.accordion-body-inner {\r
  padding: var(--space-4);\r
}\r
`;var K=`/* Dashboard and card styles */\r
\r
.dashboard-grid {\r
  display: grid;\r
  grid-template-columns: repeat(12, 1fr);\r
  gap: var(--space-4);\r
  align-items: start;\r
}\r
\r
/* Card sizing */\r
.card-full { grid-column: span 12; }\r
.card-half { grid-column: span 6; }\r
.card-third { grid-column: span 4; }\r
.card-quarter { grid-column: span 3; }\r
\r
@media (max-width: 1024px) {\r
  .card-half { grid-column: span 12; }\r
  .card-third { grid-column: span 6; }\r
  .card-quarter { grid-column: span 4; }\r
}\r
\r
@media (max-width: 768px) {\r
  .dashboard-grid {\r
    grid-template-columns: 1fr;\r
    gap: var(--space-3);\r
  }\r
  .card-full, .card-half, .card-third, .card-quarter {\r
    grid-column: span 1;\r
  }\r
}\r
\r
/* Atmosphere hero card */\r
.atmosphere-card {\r
  background: linear-gradient(135deg, var(--hw-surface) 0%, var(--hw-surface-2) 100%);\r
  border-radius: var(--radius-xl);\r
  padding: var(--space-5);\r
  position: relative;\r
  overflow: hidden;\r
  min-height: 280px;\r
}\r
\r
.atmosphere-temp {\r
  font-size: var(--fs-hero);\r
  font-weight: 700;\r
  color: var(--hw-text);\r
  line-height: 1;\r
  margin: var(--space-3) 0;\r
}\r
\r
.atmosphere-condition {\r
  font-size: var(--fs-xl);\r
  color: var(--hw-muted);\r
  margin-bottom: var(--space-4);\r
}\r
\r
.atmosphere-stats {\r
  display: grid;\r
  grid-template-columns: repeat(4, 1fr);\r
  gap: var(--space-4);\r
}\r
\r
@media (max-width: 768px) {\r
  .atmosphere-stats { grid-template-columns: repeat(2, 1fr); }\r
}\r
\r
.stat-item {\r
  display: flex;\r
  flex-direction: column;\r
  gap: var(--space-1);\r
}\r
\r
.stat-label {\r
  font-size: var(--fs-xs);\r
  color: var(--hw-muted);\r
  text-transform: uppercase;\r
  letter-spacing: 0.05em;\r
}\r
\r
.stat-value {\r
  font-size: var(--fs-lg);\r
  font-weight: 600;\r
  color: var(--hw-text);\r
}\r
\r
/* Forecast card */\r
.forecast-card-header {\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  margin-bottom: var(--space-4);\r
}\r
\r
.forecast-toggle {\r
  display: flex;\r
  background: var(--hw-surface-2);\r
  border-radius: var(--radius-full);\r
  padding: 2px;\r
}\r
\r
.forecast-toggle-btn {\r
  padding: var(--space-1) var(--space-3);\r
  border: none;\r
  border-radius: var(--radius-full);\r
  background: transparent;\r
  color: var(--hw-muted);\r
  font-size: var(--fs-sm);\r
  cursor: pointer;\r
  min-width: 44px;\r
  height: 28px;\r
}\r
.forecast-toggle-btn.is-active {\r
  background: var(--hw-accent);\r
  color: #fff;\r
}\r
\r
.forecast-list {\r
  display: flex;\r
  flex-direction: column;\r
  gap: var(--space-2);\r
}\r
\r
.forecast-row {\r
  display: grid;\r
  grid-template-columns: 80px 40px 1fr 60px;\r
  align-items: center;\r
  gap: var(--space-3);\r
  padding: var(--space-2) 0;\r
  border-bottom: 1px solid var(--hw-border);\r
  cursor: pointer;\r
  transition: background var(--dur-fast) var(--ease);\r
  min-height: 44px;\r
}\r
.forecast-row:hover { background: var(--hw-hover); }\r
.forecast-row:last-child { border-bottom: none; }\r
\r
.forecast-day { font-weight: 600; color: var(--hw-text); font-size: var(--fs-body); }\r
.forecast-icon { font-size: var(--fs-lg); text-align: center; }\r
.forecast-condition { color: var(--hw-muted); font-size: var(--fs-sm); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\r
.forecast-temp { font-weight: 600; color: var(--hw-text); text-align: right; font-size: var(--fs-body); }\r
\r
/* Moon & sun card */\r
.moon-sun-grid {\r
  display: grid;\r
  grid-template-columns: 1fr 1fr;\r
  gap: var(--space-4);\r
}\r
@media (max-width: 768px) {\r
  .moon-sun-grid { grid-template-columns: 1fr; }\r
}\r
\r
.moon-phase-display {\r
  display: flex;\r
  align-items: center;\r
  gap: var(--space-4);\r
}\r
\r
.moon-phase-icon {\r
  width: 80px;\r
  height: 80px;\r
  flex-shrink: 0;\r
}\r
\r
.sun-info-row {\r
  display: flex;\r
  justify-content: space-between;\r
  padding: var(--space-1) 0;\r
  font-size: var(--fs-body);\r
}\r
\r
/* NWS alerts card */\r
.alerts-empty { text-align: center; padding: var(--space-6); color: var(--hw-muted); }\r
.alert-item {\r
  padding: var(--space-3);\r
  border-radius: var(--radius-md);\r
  border-left: 3px solid var(--hw-warning);\r
  background: var(--hw-surface-2);\r
  margin-bottom: var(--space-2);\r
  cursor: pointer;\r
}\r
.alert-item:hover { background: var(--hw-hover); }\r
.alert-item.severe { border-left-color: var(--hw-danger); }\r
.alert-item.moderate { border-left-color: var(--hw-warning); }\r
.alert-item.minor { border-left-color: var(--hw-accent); }\r
\r
.alert-headline { font-weight: 600; color: var(--hw-text); margin-bottom: var(--space-1); }\r
.alert-meta { font-size: var(--fs-sm); color: var(--hw-muted); }\r
\r
/* Hurricane card */\r
.hurricane-threat-badge {\r
  display: inline-flex;\r
  align-items: center;\r
  gap: var(--space-1);\r
  padding: var(--space-1) var(--space-3);\r
  border-radius: var(--radius-full);\r
  font-size: var(--fs-sm);\r
  font-weight: 600;\r
  text-transform: uppercase;\r
  letter-spacing: 0.05em;\r
}\r
.threat-none { background: var(--hw-success); color: #fff; }\r
.threat-monitor { background: var(--hw-accent); color: #fff; }\r
.threat-watch { background: var(--hw-warning); color: #fff; }\r
.threat-high { background: var(--hw-danger); color: #fff; }\r
\r
/* Space card */\r
.space-card-content { text-align: center; padding: var(--space-4); }\r
.space-card-title { font-weight: 600; color: var(--hw-text); margin-bottom: var(--space-2); }\r
\r
/* Detail sheet */\r
.detail-sheet-backdrop {\r
  position: fixed;\r
  top: 0; left: 0; right: 0; bottom: 0;\r
  background: rgba(0,0,0,0.5);\r
  display: flex;\r
  align-items: flex-end;\r
  justify-content: center;\r
  z-index: 100;\r
  opacity: 0;\r
  pointer-events: none;\r
  transition: opacity var(--dur-normal) var(--ease);\r
}\r
.detail-sheet-backdrop.is-open { opacity: 1; pointer-events: auto; }\r
\r
.detail-sheet {\r
  background: var(--hw-surface);\r
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;\r
  padding: var(--space-4);\r
  width: 100%;\r
  max-width: 480px;\r
  max-height: 80vh;\r
  overflow-y: auto;\r
  transform: translateY(100%);\r
  transition: transform var(--dur-normal) var(--ease-out);\r
  touch-action: pan-y;\r
}\r
.detail-sheet-backdrop.is-open .detail-sheet { transform: translateY(0); }\r
\r
.detail-sheet-handle {\r
  width: 36px;\r
  height: 4px;\r
  background: var(--hw-border-strong);\r
  border-radius: var(--radius-full);\r
  margin: 0 auto var(--space-4);\r
}\r
\r
@media (min-width: 769px) {\r
  .detail-sheet-backdrop { align-items: center; }\r
  .detail-sheet { border-radius: var(--radius-xl); }\r
}\r
\r
/* Edit mode */\r
.dashboard-edit-bar {\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  padding: var(--space-2) var(--space-4);\r
  background: var(--hw-accent-dim);\r
  border-radius: var(--radius-md);\r
  margin-bottom: var(--space-3);\r
}\r
\r
.card-slot {\r
  position: relative;\r
  transition: opacity var(--dur-fast) var(--ease);\r
}\r
.card-slot.is-dragging { opacity: 0.5; }\r
.card-slot.drag-over { outline: 2px dashed var(--hw-accent); }\r
\r
.card-slot-controls {\r
  position: absolute;\r
  top: var(--space-2);\r
  right: var(--space-2);\r
  display: flex;\r
  gap: var(--space-1);\r
  z-index: 10;\r
}\r
\r
.card-slot-btn {\r
  width: 32px;\r
  height: 32px;\r
  border: none;\r
  border-radius: var(--radius-sm);\r
  background: var(--hw-elevated);\r
  color: var(--hw-text);\r
  cursor: pointer;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  font-size: var(--fs-md);\r
  opacity: 0.7;\r
  transition: opacity var(--dur-fast);\r
}\r
.card-slot-btn:hover { opacity: 1; }\r
`;var ae=I+V+Q+K,v=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._panel=null,this._config={},this._currentView="forecast",this._isNarrow=!1,this._narrowOverride=null,this._ws=null,this._version=null,this._appearance={mode:"dark",overrides:{}},this._dashboardLayout=null,this._editMode=!1,this._views={},this._appBar=null,this._detailSheet=null,this._scheduleRender=R(()=>this._render(),50)}get hass(){return this._hass}set hass(e){this._hass=e,e&&!this._ws&&(this._ws=new f(e)),this._scheduleRender()}get panel(){return this._panel}set panel(e){this._panel=e,this._scheduleRender()}get _isNarrow(){return this._narrowOverride!==null?this._narrowOverride:this.__isNarrow}set _isNarrow(e){this.__isNarrow=e,this.classList.toggle("is-narrow",e),this._scheduleRender()}connectedCallback(){this._injectStyles(),this._setupMediaQuery(),this._setupKeyboard(),this._loadConfig(),this._scheduleRender()}disconnectedCallback(){this._mediaQueryCleanup&&this._mediaQueryCleanup(),this._resizeObserver&&this._resizeObserver.disconnect()}_injectStyles(){let e=document.createElement("style");e.textContent=ae,this.shadowRoot.appendChild(e)}_setupMediaQuery(){this._mediaQueryCleanup=q("(max-width: 768px)",e=>{this._isNarrow=e})}_setupKeyboard(){this.addEventListener("keydown",e=>{e.key==="Escape"&&this._detailSheet&&this._detailSheet.isOpen&&this._detailSheet.close()})}async _loadConfig(){if(this._ws)try{let e=await this._ws.getConfig();this._config=e||{},this._appearance=e.appearance||{mode:"dark",overrides:{}},this._dashboardLayout=e.dashboard_layout||null,this._applyTheme(),this._scheduleRender()}catch(e){console.warn("Failed to load config:",e)}}_applyTheme(){O(this,this._appearance.mode,this._appearance.overrides)}_navigateTo(e){this._currentView=e,this._scheduleRender()}_initView(e){if(this._views[e])return this._views[e];let a=this.shadowRoot,t=this,r;switch(e){case"forecast":r=new E({panel:t,ws:this._ws,root:a});break;case"hurricanes":r=new S({panel:t,ws:this._ws,root:a});break;case"space":r=new T({panel:t,ws:this._ws,root:a});break;case"alerts":r=new N({panel:t,ws:this._ws,root:a});break;case"trends":r=new M({panel:t,ws:this._ws,root:a});break;case"settings":r=new L({panel:t,ws:this._ws,root:a});break}return r&&(this._views[e]=r),r}_render(){let e=this.shadowRoot;F(e),this._appBar=new z({panel:this,currentView:this._currentView,isNarrow:this._isNarrow,onNavigate:s=>this._navigateTo(s)}),e.appendChild(this._appBar.render());let a=document.createElement("main");a.className="content-area";let t=this._initView(this._currentView);t?a.appendChild(t.render()):a.innerHTML='<div class="flex-center" style="height:200px"><p class="text-muted">Loading...</p></div>',e.appendChild(a),this._detailSheet=new $({panel:this}),e.appendChild(this._detailSheet.render());let r=document.createElement("div");r.className="toast-container",r.id="toast-container",e.appendChild(r)}showToast(e,a="info",t=3e3){let r=B(this.shadowRoot,"#toast-container");if(!r)return;let s=document.createElement("div");s.className=`toast ${a}`,s.textContent=e,r.appendChild(s),setTimeout(()=>{s.style.opacity="0",s.style.transform="translateX(100%)",s.style.transition="all 300ms ease",setTimeout(()=>s.remove(),300)},t)}openDetailSheet(e){this._detailSheet&&this._detailSheet.open(e)}closeDetailSheet(){this._detailSheet&&this._detailSheet.close()}async saveConfig(e){if(this._ws)try{let a={...this._config,...e};return await this._ws.setConfig(a),this._config=a,e.appearance&&(this._appearance=e.appearance,this._applyTheme()),this.showToast("Settings saved","success"),!0}catch(a){return this.showToast("Failed to save: "+a.message,"error"),!1}}};customElements.get("home-weather-panel")||customElements.define("home-weather-panel",v);window.HomeWeatherPanel=v;})();
