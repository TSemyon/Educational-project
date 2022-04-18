window.addEventListener('DOMContentLoaded', () => {

    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items')

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide')
            item.classList.remove('show', 'fade')
        })
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active')
        })
    }

    // function hideTabContent() {
    //     tabsContent.forEach(item => {
    //         item.style.display ='none'
    //     })
    //     tabs.forEach(item => {
    //         item.classList.remove('tabheader__item_active')
    //     })
    // }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade')
        tabsContent[i].classList.remove('hide')
        tabs[i].classList.add('tabheader__item_active')
    }

    // function showTabContent(i = 0) {
    //     tabsContent[i].style.display = 'block'
    //     tabs[i].classList.add('tabheader__item_active')
    // }

    hideTabContent()
    showTabContent()

    tabsParent.addEventListener('click', (event) => {
        const target = event.target

        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if(target == item) {
                    hideTabContent()
                    showTabContent(i)
                }
            })
        }
    })

    // Timer

    const deadline = '2022-03-18'

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
        days = Math.floor(t / (1000 * 60 * 60 * 24)),
        hours = Math.floor((t / (1000 * 60 * 60) % 24)),
        minutes = Math.floor((t / 1000 / 60) % 60),
        seconds = Math.floor((t / 1000) % 60)

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }

    function getZero(num) {
        if(num >=0 && num < 10) {
            return `0${num}`
        } else {
            return num
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000)

        updateClock()

        function updateClock() {
            const t = getTimeRemaining(endtime)

            days.innerHTML = getZero(t.days)
            hours.innerHTML = getZero(t.hours)
            minutes.innerHTML = getZero(t.minutes)
            seconds.innerHTML = getZero(t.seconds)

            if(t.total <= 0) {
                clearInterval(timeInterval)
            }
        }
    }
    setClock('.timer', deadline)

    //Модальное окно

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal')
    
    function openModal() {
        modal.classList.add('show')
        modal.classList.remove('hide')
        document.body.style.overflow = 'hidden'
        // clearInterval(modalTimerId)
    }
    
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal)
    })

    function closeModal() {
        modal.classList.add('hide')
        modal.classList.remove('show')
        document.body.style.overflow = ''
    }

    modal.addEventListener('click', (event) => {
        if(event.target == modal || event.target.getAttribute('data-close') == '') {
            closeModal()
        }
    })

    document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape') {
            closeModal()
        }
    })

    const modalTimerId = setTimeout(openModal, 50000)
    // console.log(closeModal)

    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal()
            window.removeEventListener('scroll', showModalByScroll)
        }
    }
    window.addEventListener('scroll', showModalByScroll)

    //Классы для карточек
    
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src
            this.alt = alt
            this.title = title
            this.descr = descr
            this.price = price
            this.parent = document.querySelector(parentSelector)
            this.tranfer = 27
            this.changeToUAH()
        }

        changeToUAH() {
            this.price = this.price * this.tranfer
        }

        render() {
            const element = document.createElement('div')
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                </div>
            `
            this.parent.append(element)
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url)

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }

        return await res.json()
    }

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
            // data.forEach(({img, iltimg, title, descr, price}) => {
            //     new MenuCard(img, iltimg, title, descr, price, '.menu .container').render()
            // })
    //     })

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, iltimg, title, descr, price}) => {
                new MenuCard(img, iltimg, title, descr, price, '.menu .container').render()
            })
        })

    // В РУЧНУЮ СОЗДАЕМ КЛАССЫ
    // new MenuCard(
    //     "img/tabs/vegy.jpg",
    //     "vegy",
    //     'Меню "Фитнес"',
    //     'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    //     9,
    //     '.menu .container'
    // ).render()

    // new MenuCard(
    //     "img/tabs/elite.jpg",
    //     "elite",
    //     'Меню "Фитнес"',
    //     'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    //     14,
    //     '.menu .container'
    // ).render()

    // new MenuCard(
    //     "img/tabs/post.jpg",
    //     "post",
    //     'Меню "Постное"',
    //     'Меню “Постное” - это тщательный подбор ингредиентов: полное        отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    //     21,
    //     '.menu .container'
    // ).render()
    
    // Forms отправка формы

    const forms = document.querySelectorAll('form')

    forms.forEach(item => {
        bindPostData(item)
    })

    const message = {
        loading: 'img/form/spinner.svg',
        succes: 'Спасибо, мы вам перезвоним',
        failure: 'Что-то пошло не так'
    }

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        })

        return await res.json()
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            const statusMessage = document.createElement('img')
            statusMessage.src = message.loading
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto
            `
            // form.append(statusMessage)
            form.insertAdjacentElement('afterend', statusMessage)

            // Fetch
            // const request = new XMLHttpRequest
            // request.open('POST', 'js/server.php') // Отправка на сервер через XMLHttpReqeust

            // request.setRequestHeader('Content-type', 'application/json')

            const formData = new FormData(form)

            const json = JSON.stringify(Object.fromEntries(formData.entries()))

            // const object = {}

            // formData.forEach(function (value, key) {
            //     object[key] = value
            // })
            
            // const json = JSON.stringify(object)

            // request.send(json)

            // fetch('server.php', {
            //     method: "POST",
            //     headers: {
            //         'Content-type': 'application/json'
            //     },
            //     body: JSON.stringify(object)
            // })

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data)
                showThanksModal(message.succes)
                statusMessage.remove()
            }).catch(() => {
                showThanksModal(message.failure)
            }).finally(() => {
                form.reset()
            })
        })
        //     request.addEventListener('load', () => {
        //         if(request.status === 200) {
        //             console.log(request.response)
        //             showThanksModal(message.succes)
        //             form.reset()
        //             statusMessage.remove()

        //         } else {
        //             showThanksModal(message.failure)
        //         }
        //     })
        // })
    }
   
    function showThanksModal(message) {
        const prevModalDiaolog = document.querySelector('.modal__dialog')

        prevModalDiaolog.classList.add('hide')
        openModal()

        const thanksModal = document.createElement('div')
        thanksModal.classList.add('modal__dialog')
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `

        document.querySelector('.modal').append(thanksModal)
        setTimeout(() => {
            thanksModal.remove()
            prevModalDiaolog.classList.remove('hide')
            prevModalDiaolog.classList.add('show')
            
            closeModal()
        }, 4000)
    }
    
    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res))
    

    //Слайдер// 

    const slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        slider = document.querySelector('.offer__slider'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width
    
    let slideIndex = 1
    let offset = 0

    if(slides.length < 10) {
        total.textContent = `0${slides.length}`
        current.textContent = `0${slideIndex}`
    } else {
        total.textContent = slides.length
        current.textContent = slideIndex
    }

    slidesField.style.width = 100 * slides.length + '%'
    slidesField.style.display = 'flex'
    slidesField.style.transition = '0.5s all'

    slidesWrapper.style.overflow = 'hidden'

    slides.forEach(slide => {
        slide.style.width = width
    })

    slider.style.position = 'relative'
    const indicators = document.createElement('ol'),
        dots = []

    indicators.classList.add('carousel-indicators')
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `
    slider.append(indicators)

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li')
        dot.setAttribute('data-slide-to', i + 1)
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `
        if(i == 0) {
            dot.style.opacity = 1
        }
        indicators.append(dot)
        dots.push(dot)
    }

    next.addEventListener('click', () => {
        if(offset == +width.slice(0, width.length - 2) * (slides.length - 1)){
            offset = 0
        }else {
            offset += +width.slice(0, width.length - 2)
        }
        slidesField.style.transform = `translateX(-${offset}px)`

        if(slideIndex == slides.length) {
            slideIndex = 1
        } else {
            slideIndex++
        }

        if(slides.length < 10) {
            current.textContent = `0${slideIndex}`
        } else {
            current.textContent = slideIndex
        }

        dots.forEach(dot => dot.style.opacity = '.5')
        dots[slideIndex - 1].style.opacity = 1
    })

    prev.addEventListener('click', () => {
        if(offset == 0){
            offset = +width.slice(0, width.length - 2) * (slides.length - 1)
        }else {
            offset -= +width.slice(0, width.length - 2)
        }
        slidesField.style.transform = `translateX(-${offset}px)`

        if(slideIndex == 1) {
            slideIndex = slides.length
        } else {
            slideIndex--
        }

        if(slides.length < 10) {
            current.textContent = `0${slideIndex}`
        } else {
            current.textContent = slideIndex
        }

        dots.forEach(dot => dot.style.opacity = '.5')
        dots[slideIndex - 1].style.opacity = 1
    })

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to')

            slideIndex = slideTo
            offset = +width.slice(0, width.length - 2) * (slideTo - 1)

            slidesField.style.transform = `translateX(-${offset}px)`

            if(slides.length < 10) {
                current.textContent = `0${slideIndex}`
            } else {
                current.textContent = slideIndex
            }

            dots.forEach(dot => dot.style.opacity = '.5')
            dots[slideIndex - 1].style.opacity = 1
        })
    })

    //Calc

    const result = document.querySelector('.calculating__result span')
    let sex = 'female',
    height, weight, age,
    ratio = 1.375;


    function calcTotal() {
        if(!sex || ! height || !weight || !age || ratio) {
            result.textContent = '____'
            return
        }

        if(sex === 'female') {
            result.textContent = (447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio
        } else {
            result.textContent = (88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio
        }
    }

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____'; // Можете придумать что угодно
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }v

    calcTotal();

    function getStaticInformation(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                } else {
                    sex = e.target.getAttribute('id');
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);
    
                calcTotal();
            });
        });
    }

    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            switch(input.getAttribute('id')) {
                case "height":
                    height = +input.value;
                    break;
                case "weight":
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
    









    // showSlides(slideIndex)

    // if(slides.length < 10) {
    //     total.textContent = `0${slides.length}`
    // } else {
    //     total.textContent = slides.length
    // }

    // function showSlides(n) {
    //     if(n > slides.length) {
    //         slideIndex = 1
    //     }
    //     if(n < 1) {
    //         slideIndex = slides.length
    //     }

    //     slides.forEach(item => item.style.display = 'none')
    //     slides[slideIndex - 1].style.display = 'block'

    //     if(slides.length < 10) {
    //         current.textContent = `0${slideIndex}`
    //     } else {
    //         current.textContent = slideIndex
    //     }
    // }

    // function plusSlides(n) {
    //     showSlides(slideIndex += n)
    // }

    // prev.addEventListener('click', () => {
    //     plusSlides(-1)
    // })

    // next.addEventListener('click', () => {
    //     plusSlides(+1)
    // })

})
















// function openModal() {
//     modal.classList.add('show')
//     modal.classList.remove('hide')
//     document.body.style.overflow = 'hidden'
//     clearInterval(modalTimerId)

// }

// modalTrigger.forEach(btn => {
//     btn.addEventListener('click', (openModal))
// })

// function closeModal() {
//     modal.classList.add('hide')
//     modal.classList.remove('show')
//     document.body.style.overflow = ''
// }

// modalCloseBtn.addEventListener('click', (closeModal))

// const modalTimerId = setTimeout(openModal, 3000)

// document.addEventListener('keydown' , (e) => {
//     if(e.code == 'Escape') {
//         closeModal()
//     }
// })

// modal.addEventListener('click', (event) => {
//     if(event.target == modal) {
//         closeModal()
//     }
// })
