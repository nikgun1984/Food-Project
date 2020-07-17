window.addEventListener('DOMContentLoaded', ()=>{
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent(){
        tabContent.forEach((item)=>{
            item.classList.add('hide');
            item.classList.remove('show','fade');
        });
        tabs.forEach((item)=>{
            item.classList.remove('tabheader__item_active');
        });

    }

    function showTabContent(i = 0){ // ES6 feature if no arguments provided, default value will be 0
        tabContent[i].classList.add('show','fade');
        tabContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event)=>{
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach((item,i)=>{
                if(target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    })


    //Timer

    const deadLine = '2020-07-20';

    function getTimeRemaining(endTime){
        const t = Date.parse(endTime) - Date.parse(new Date()),
              days = Math.floor(t/(1000*60*60*24)); // days left till discount is over
              hours = Math.floor((t / (1000*60*60))%24),
              minutes = Math.floor((t/(1000*60)%60)),
              seconds = Math.floor((t/(1000)%60));
        return {
            'total': t,
            days,
            hours,
            minutes,
            seconds
        };
    }

    function getZero(num){
        if(num>=0 && num<10){
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector,endTime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
        updateClock();
        function updateClock(){
            const t = getTimeRemaining(endTime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadLine);

    //Modal Window

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');
    
    modalTrigger.forEach(btn => {
        btn.addEventListener('click',openModal);
    });

    function closeModal(){
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal(){
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';// prevents from scrolling while using modal
        clearInterval(modalTimerId);
    }

    modal.addEventListener('click',(e)=>{
        if(e.target === modal || e.target.getAttribute('data-close') == ''){
            closeModal();
        }
    });
    //press 'escape' to leave the modal window 
    document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape' && modal.classList.contains('show')){
            closeModal();
        }
    });
    //modal will be open automatically after 3 second if it was not open yet otherwise it wont be open
    const modalTimerId = setTimeout(openModal, 300000);
    
    //once you reach the end of the page you will get modal open
    //but it will be open once
    function showModalByScroll(){
        if(window.pageYOffset +document.documentElement.clientHeight >=document.documentElement.scrollHeight){
            openModal();
            //will be only open once and then wont bother u again
            window.removeEventListener('scroll',showModalByScroll);
        }
    }
    
    window.addEventListener('scroll', showModalByScroll);

    // Cards in the end of the page

    class Menu {
        constructor(src,alt,title,descr,price,parentSelector, ...classes){
            this.src = src; // we need src and alt if no image is available
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 71;
            this.changeToCurrency();
        }
        
        changeToCurrency() {
            this.price = this.price*this.transfer;
        }

        render(){
            const element = document.createElement('div');
            if(this.classes.length === 0){
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `
                <img src = ${this.src} alt = ${this.alt}>
                <h3 class = "menu__item-subtitle">${this.title}</h3> 
                <div class = "menu__item-descr">${this.descr}</div> 
                <div class = "menu__item-divider"></div> 
                <div class = "menu__item-price">
                    <div class = "menu__item-cost">Price</div> 
                    <div class = "menu__item-total"><span>${this.price}</span> rubles/day </div> 
                </div> 
            `;
            this.parent.append(element);
        }
        
    }

    // new Menu(
    //     'img/tabs/elite.jpg',
    //     'elite',
    //     'Premium Menu',
    //     'In the Premium menu, we use not only a beautiful packaging design, but also high-quality execution of dishes. Red fish, seafood, fruits - a restaurant menu without going to a restaurant!',
    //     9,
    //     '.menu .container',
    //     'menu__item'
    // ).render();
    const getResources = async (url) => {
        const res = await fetch(url);
        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };
// Using classes
    // getResources('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img,alt,title,descr,price})=>{ // destructure the object this way
    //             new Menu(img,alt,title,descr,price, '.menu .container').render();
    //         })
    //     });

    // getResources('http://localhost:3000/menu')
    //     .then(data =>createCard(data));
    
    //difference between fetch and axios, axios will return more detail object
    axios.get('http://localhost:3000/menu')
        .then(elem=> {
            elem.data.forEach(({img,alt,title,descr,price})=>{ //(data is the response that was provided by the server data: {})
            new Menu(img,alt,title,descr,price, '.menu .container').render();
        });
    });

    function createCard(data){
        data.forEach(({img,alt,title,descr,price})=>{
            const element = document.createElement('div');
            element.classList.add('menu__item');
            element.innerHTML = `
                <img src = ${img} alt = ${alt}>
                    <h3 class = "menu__item-subtitle">${title}</h3> 
                    <div class = "menu__item-descr">${descr}</div> 
                    <div class = "menu__item-divider"></div> 
                    <div class = "menu__item-price">
                    <div class = "menu__item-cost">Price</div> 
                    <div class = "menu__item-total"><span>${price*71}</span> rubles/day </div> 
                </div> 
            `;
            document.querySelector('.menu .container').append(element);
        })
    }
    //Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: "Thanks! We will be with you shortly",
        failure: 'Something went wrong...'
    }

    forms.forEach((item)=>{
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e)=>{
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend',statusMessage);
            // -----------XMLHttpRequest--------------------
            // const request = new XMLHttpRequest();
            // request.open('POST','server.php');

            //request.setRequestHeader('Content-type','application/json; charset=utf-8');
            const formData = new FormData(form);

            // const object = {};
            // formData.forEach(function(value,key){
            //     object[key]=value;
            // });
            //        (transform Object to JSON(transform matrix to object (create matrix of [key,val] arrays)))
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            //const json = JSON.stringify(object);

            //request.send(json);

            // -----------Using fetch and Promises-----------
            // fetch('server.php',{
            //     method: 'POST',
            //     headers: {
            //         'Content-type': 'application/json'
            //     },
            //     body: JSON.stringify(object)
            // })
            postData('http://localhost:3000/requests',json) //copy url from json-server terminal
            // .then(data => data.text())
                .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();})
                .catch(() => {
                showThanksModal(message.failure);}) // will throw an error if no internet, 4xx error usually wont throw errors with fetch
                .finally(()=>{
                form.reset();
                });

            // request.addEventListener('load',()=>{
            //     if(request.status === 200){
            //         console.log(request.response);
            //         showThanksModal(message.success);
            //         form.reset();
            //         statusMessage.remove();

            //     } else {
            //         showThanksModal(message.failure);
            //     }
            // });
        });
    }

    function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class = 'modal__content'>
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(()=>{
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        },4000);
    }

    fetch('http://localhost:3000/menu') // url is from json-server resources in terminal
    .then(data => data.json())
    .then(res => console.log(res));
    // // TO Post something to server using fetch and promises
    // fetch('https://jsonplaceholder.typicode.com/posts', { //add settings as an Object
    //     method: 'POST',
    //     body: JSON.stringify({name:'Nick'}), // will return 101 as ID because there are 100 other posts in API were fetched
    //     headers: {
    //         'Content-type': 'application/json'
    //     }
    // }) // will return promise this is why we can use .then chain
    //     .then(response => response.json()) // response.json() will return promise as well
    //     .then(json => console.log(json));


    //Slider

    const prevArrow = document.querySelector('.offer__slider-prev'),
          nextArrow = document.querySelector('.offer__slider-next'),
          images = document.querySelectorAll('.offer__slide'),
          totalImages = document.querySelector('#total'),
          currentImage = document.querySelector('#current'),
          wrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(wrapper).width;
    let index = 1;
    let offset = 0; //otstup
    //console.log(+width.slice(0,width.length-2)*(images.length));

    if(images.length<10){
        total.textContent = `0${images.length}`;
        currentImage.textContent = `0${index}`;

    } else {
        total.textContent = images.length;
        currentImage.textContent = index;
    }

    slidesField.style.width = 100*images.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    wrapper.style.overflow = 'hidden';
    images.forEach(image =>{
        image.style.width = width;
    });

    nextArrow.addEventListener('click',()=>{
        if(offset == +width.slice(0,width.length-2)*(images.length-1)){
            offset = 0;
        } else {
            offset += +width.slice(0,width.length-2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(index == images.length){
            index = 1;
        } else {
            index++;
        }

        if(images.length<10){
            currentImage.textContent = `0${index}`;
        } else {
            currentImage.textContent = index;
        }
    });

    prevArrow.addEventListener('click', ()=>{
        if(offset==0){
            offset = +width.slice(0,width.length-2)*(images.length-1);
        } else {
            offset -= +width.slice(0,width.length-2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(index == 1){
            index = images.length;
        } else {
            index--;
        }

        if(images.length<10){
            currentImage.textContent = `0${index}`;
        } else {
            currentImage.textContent = index;
        }
    });

    // showImage(index);

    // if(images.length<10){
    //     total.textContent = `0${images.length}`;
    // } else {
    //     total.textContent = images.length;
    // }

    // function showImage(i){ 
    //     if(i > images.length){
    //         index = 1;
    //     }
    //     if(i<1){
    //         index = images.length;
    //     }
    //     images.forEach(image => image.style.display = 'none');
    //     images[index-1].style.display = 'block';

    //     if(index<10){
    //         currentImage.textContent = `0${index}`;
    //     } else {
    //         currentImage.textContent = index;
    //     }
    // }

    // function plusSlides(i){
    //     showImage(index+= i);
    // }

    // prevArrow.addEventListener('click', ()=>plusSlides(-1));
    // nextArrow.addEventListener('click', ()=>plusSlides(1));
});


//API is Application Program Interface
// Common API is DOM API e.g: document has querySelector() is built-in in browsers
// Google Maps API

// fetch API is one of them


