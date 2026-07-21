// =========================================
// KRMU QUIZ PORTAL
// index.js
// =========================================

// ==============================
// Smooth Scroll
// ==============================

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

const target=document.querySelector(this.getAttribute("href"));

if(target){

target.scrollIntoView({

behavior:"smooth"

});

}

});

});

// ==============================
// Greeting
// ==============================

const greeting=document.querySelector(".hero-content h3");

const hour=new Date().getHours();

if(hour<12){

greeting.innerHTML="🌅 GOOD MORNING";

}

else if(hour<17){

greeting.innerHTML="☀ GOOD AFTERNOON";

}

else{

greeting.innerHTML="🌙 GOOD EVENING";

}

// ==============================
// Live Date & Time
// ==============================

const clock=document.createElement("div");

clock.className="live-time";

document.body.appendChild(clock);

function updateClock(){

const now=new Date();

clock.innerHTML=

now.toLocaleDateString()+"<br>"+

now.toLocaleTimeString();

}

setInterval(updateClock,1000);

updateClock();

// ==============================
// Counter Animation
// ==============================

const counters=document.querySelectorAll(".stat-box h1");

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

animateCounter(entry.target);

observer.unobserve(entry.target);

}

});

});

counters.forEach(counter=>{

observer.observe(counter);

});

function animateCounter(counter){

let value=counter.innerText;

let number=parseInt(value);

let count=0;

let speed=Math.ceil(number/60);

counter.innerText="0";

const interval=setInterval(()=>{

count+=speed;

if(count>=number){

counter.innerText=value;

clearInterval(interval);

}

else{

counter.innerText=count+"+";

}

},30);

}

// ==============================
// Reveal Animation
// ==============================

const cards=document.querySelectorAll(

".feature-card,.about-card,.why-card,.stat-box"

);

const reveal=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";

}

});

});

cards.forEach(card=>{

card.style.opacity="0";

card.style.transform="translateY(60px)";

card.style.transition="1s";

reveal.observe(card);

});

// ==============================
// Navbar Background
// ==============================

window.addEventListener("scroll",()=>{

const navbar=document.querySelector(".navbar");

if(window.scrollY>100){

navbar.style.background="#062458";

}

else{

navbar.style.background="rgba(6,35,88,.88)";

}

});

// ==============================
// Hero Button Animation
// ==============================

const buttons=document.querySelectorAll(

".student-btn,.admin-btn"

);

buttons.forEach(btn=>{

btn.addEventListener("mouseenter",()=>{

btn.style.transform="translateY(-6px) scale(1.05)";

});

btn.addEventListener("mouseleave",()=>{

btn.style.transform="translateY(0px) scale(1)";

});

});

// ==============================
// Typing Effect
// ==============================

const title=document.querySelector(".hero-content h1");

const text=title.innerText;

title.innerText="";

let index=0;

function typing(){

if(index<text.length){

title.innerHTML+=text.charAt(index);

index++;

setTimeout(typing,80);

}

}

typing();

// ==============================
// End
// ==============================