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

    new Menu(
        'img/tabs/fitness.jpg',
        'fitness',
        'Fitness Menu',
        'The Fitness menu is a new approach to cooking: more fresh vegetables and fruits. Product of active and healthy people. This is a brand new product with the best price and high quality!',
        7,
        '.menu .container',
        'menu__item'
    ).render();

    new Menu(
        "img/tabs/lean.jpg",
        'lean',
        'Lean Menu',
        'The Lean menu is a careful selection of ingredients: the complete absence of animal products, almond,oat, coconut or buckwheat milk, the right amount of protein due to tofu and imported vegetarian steaks.',
        10,
        '.menu .container',
        'menu__item'
    ).render();

    new Menu(
        "img/tabs/keto.jpg",
        'keto',
        'Keto Menu',
        'Our ketogenic diet, meals and snacks are centered around the following foods: eggs, poultry, fish, meat, nuts, healthy fats, avocados, non-starchy vegetables, condiments',
        12,
        '.menu .container',
        'menu__item'
    ).render();

    //Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: "Thanks! We will be with you shortly",
        failure: 'Something went wrong...'
    }

    forms.forEach((item)=>{
        postData(item);
    });

    function postData(form) {
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

            const object = {};
            formData.forEach(function(value,key){
                object[key]=value;
            });

            //const json = JSON.stringify(object);

            //request.send(json);

            // -----------Using fetch and Promises-----------
            fetch('server.php',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(object)
            }).then(data => data.text())
              .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure); // will throw an error if no internet, 4xx error usually wont throw errors with fetch
            }).finally(()=>{
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
});


//API is Application Program Interface
// Common API is DOM API e.g: document has querySelector() is built-in in browsers
// Google Maps API

// fetch API is one of them


