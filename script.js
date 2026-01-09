   /* =========================
       Util: Smooth scroll
    ========================== */
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener("click", (e)=>{
        const id = a.getAttribute("href");
        const el = document.querySelector(id);
        if(!el) return;
        e.preventDefault();
        el.scrollIntoView({behavior:"smooth", block:"start"});
      });
    });

    /* =========================
       Drawer (menu mobile)
    ========================== */
    const drawer = document.getElementById("drawer");
    const menuBtn = document.getElementById("menuBtn");
    const closeDrawer = ()=> drawer.classList.remove("show");

    menuBtn?.addEventListener("click", ()=>{
      drawer.classList.add("show");
      drawer.setAttribute("aria-hidden","false");
    });
    drawer?.addEventListener("click", (e)=>{
      if(e.target === drawer) closeDrawer();
    });
    drawer?.querySelectorAll("a").forEach(a=>{
      a.addEventListener("click", ()=> closeDrawer());
    });

    /* =========================
       Scroll progress
    ========================== */
    const progress = document.getElementById("progress");
    const updateProgress = () => {
      const h = document.documentElement;
      const max = (h.scrollHeight - h.clientHeight) || 1;
      progress.style.width = ((h.scrollTop / max) * 100).toFixed(2) + "%";
    };
    addEventListener("scroll", updateProgress, {passive:true});
    updateProgress();

    /* =========================
       Reveal on scroll
    ========================== */
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("show");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    document.querySelectorAll(".reveal").forEach(el=> io.observe(el));

    /* =========================
       Spotlight (mouse)
    ========================== */
    const spotlight = document.getElementById("spotlight");
    let spEnabled = !matchMedia("(prefers-reduced-motion: reduce)").matches;

    addEventListener("mousemove", (e)=>{
      if(!spEnabled) return;
      const x = (e.clientX / innerWidth) * 100;
      const y = (e.clientY / innerHeight) * 100;
      spotlight.style.setProperty("--mx", x + "%");
      spotlight.style.setProperty("--my", y + "%");
    }, {passive:true});

    addEventListener("mouseleave", ()=>{
      if(spotlight) spotlight.style.opacity = ".35";
    });
    addEventListener("mouseenter", ()=>{
      if(spotlight) spotlight.style.opacity = ".62";
    });

    /* =========================
       Parallax (lightweight)
    ========================== */
    const parallaxEls = [...document.querySelectorAll("[data-parallax]")];
    const onScrollParallax = () => {
      const y = window.scrollY || 0;
      parallaxEls.forEach(el=>{
        const k = parseFloat(el.dataset.parallax || "0.12");
        el.style.transform = `translate3d(0, ${y * k}px, 0)`;
      });
    };
    addEventListener("scroll", onScrollParallax, {passive:true});
    onScrollParallax();

    /* =========================
       Count-up
    ========================== */
    function animateCount(el){
      const to = Number(el.dataset.to || "0");
      const suffix = el.dataset.suffix || "";
      const duration = 950 + Math.random() * 650;
      const start = performance.now();
      const from = 0;

      function tick(t){
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(from + (to - from) * eased);
        el.textContent = val + suffix;
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const countIO = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          animateCount(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll(".count").forEach(el=> countIO.observe(el));

    /* =========================
       Hero text: split words animation
    ========================== */
    (function splitWords(){
      const el = document.getElementById("heroTitle");
      if(!el) return;

      // pega texto mantendo tags internas
      // estratégia: só animar nós de texto diretos (sem quebrar o span.shine)
      const nodes = [...el.childNodes];
      el.innerHTML = "";
      let idx = 0;

      nodes.forEach(node=>{
        if(node.nodeType === Node.TEXT_NODE){
          const words = node.textContent.split(/(\s+)/);
          words.forEach(w=>{
            const span = document.createElement("span");
            span.textContent = w;
            span.style.setProperty("--i", idx++);
            el.appendChild(span);
          });
        }else{
          // mantém elementos (ex.: span.shine) e anima por palavras internas
          const wrapper = document.createElement("span");
          wrapper.style.display = "inline";
          wrapper.appendChild(node);
          // anima o wrapper como um bloco
          wrapper.style.opacity = "0";
          wrapper.style.transform = "translateY(16px)";
          wrapper.style.animation = "wordIn .75s cubic-bezier(.2,.8,.2,1) forwards";
          wrapper.style.animationDelay = (idx++ * 60) + "ms";
          el.appendChild(wrapper);
        }
      });
    })();

    /* =========================
       Specs (placeholders)
    ========================== */
    const cars = {
      base: {
        items: [
          ["Motor", "Boxer 6 (turbo)"],
          ["Tração", "Traseira (RWD)"],
          ["Câmbio", "Automático (exemplo)"],
          ["Destaque", "Equilíbrio + dirigibilidade"],
          ["Uso", "Estrada + pista (casual)"],
          ["Tecnologia", "Assistências modernas"]
        ],
        hp: 385, acc: 4.2, vmax: 293
      },
      s: {
        items: [
          ["Motor", "Boxer 6 (mais pressão)"],
          ["Tração", "RWD / AWD (varia)"],
          ["Câmbio", "Automático (exemplo)"],
          ["Freios", "Upgrade (exemplo)"],
          ["Destaque", "Mais resposta"],
          ["Uso", "Estrada + track day"]
        ],
        hp: 450, acc: 3.7, vmax: 308
      },
      gts: {
        items: [
          ["Motor", "Setup esportivo"],
          ["Tração", "RWD / AWD (varia)"],
          ["Suspensão", "Mais firme (exemplo)"],
          ["Escape", "Som mais presente"],
          ["Destaque", "Pacote “driver’s car”"],
          ["Uso", "Pista com frequência"]
        ],
        hp: 480, acc: 3.4, vmax: 312
      },
      turbo: {
        items: [
          ["Motor", "Alta potência (turbo)"],
          ["Tração", "AWD"],
          ["Grip", "Muito alto"],
          ["Destaque", "Aceleração intensa"],
          ["Conforto", "Esportivo usável"],
          ["Uso", "Alta performance"]
        ],
        hp: 572, acc: 2.8, vmax: 320
      }
    };

    const specGrid = document.getElementById("specGrid");
    const hpText = document.getElementById("hpText");
    const accText = document.getElementById("accText");
    const vmaxText = document.getElementById("vmaxText");
    const hpBar = document.getElementById("hpBar");
    const accBar = document.getElementById("accBar");
    const vmaxBar = document.getElementById("vmaxBar");

    function renderSpecs(key){
      const car = cars[key];

      specGrid.innerHTML = car.items.map(([k,v]) => `
        <div class="spec">
          <div class="k">${k}</div>
          <div class="v">${v}</div>
        </div>
      `).join("");

      hpText.textContent = car.hp;
      accText.textContent = car.acc.toFixed(1);
      vmaxText.textContent = car.vmax;

      const hpPct = Math.min((car.hp / 650) * 100, 100);
      const vmaxPct = Math.min((car.vmax / 340) * 100, 100);
      const accMin = 2.6, accMax = 4.6;
      const accNorm = 1 - ((car.acc - accMin) / (accMax - accMin));
      const accPct = Math.max(0, Math.min(accNorm * 100, 100));

      requestAnimationFrame(()=>{
        hpBar.style.width = "0%";
        accBar.style.width = "0%";
        vmaxBar.style.width = "0%";
        requestAnimationFrame(()=>{
          hpBar.style.width = hpPct.toFixed(0) + "%";
          accBar.style.width = accPct.toFixed(0) + "%";
          vmaxBar.style.width = vmaxPct.toFixed(0) + "%";
        });
      });
    }
    renderSpecs("base");

    document.querySelectorAll(".tab").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        document.querySelectorAll(".tab").forEach(b=> b.classList.remove("active"));
        btn.classList.add("active");
        renderSpecs(btn.dataset.car);
      });
    });

    /* =========================
       Tour animado
    ========================== */
    const btnTour = document.getElementById("btnTour");
    const tourOrder = ["#visao", "#engenharia", "#specs", "#galeria", "#linha", "#faq", "#contato"];
    let tourIndex = 0;

    btnTour.addEventListener("click", ()=>{
      const id = tourOrder[tourIndex % tourOrder.length];
      const el = document.querySelector(id);
      if(el){
        el.scrollIntoView({behavior:"smooth", block:"start"});
        el.animate([
          { filter:"brightness(1)", transform:"translateY(0)" },
          { filter:"brightness(1.12)", transform:"translateY(-2px)" },
          { filter:"brightness(1)", transform:"translateY(0)" }
        ], { duration: 620, easing:"cubic-bezier(.2,.8,.2,1)" });
      }
      tourIndex++;
    });

    /* =========================
       Gallery controls
    ========================== */
    const gallery = document.getElementById("gallery");
    const gPrev = document.getElementById("gPrev");
    const gNext = document.getElementById("gNext");

    function scrollGallery(dir){
      if(!gallery) return;
      const amount = Math.min(460, gallery.clientWidth * 0.9);
      gallery.scrollBy({ left: dir * amount, behavior: "smooth" });
    }
    gPrev?.addEventListener("click", ()=> scrollGallery(-1));
    gNext?.addEventListener("click", ()=> scrollGallery(1));