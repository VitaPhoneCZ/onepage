class PureFullPage {
  constructor(options) {
    const defaultOptions = {
      isShowNav: true,
      definePages: () => {},
    };
    utils.polyfill();
    this.options = Object.assign(defaultOptions, options);
    this.options.definePages = this.options.definePages.bind(this);
    this.container = document.querySelector('#pureFullPage');
    this.pages = document.querySelectorAll('.page');
    this.pagesNum = this.pages.length;
    this.navDots = [];
    this.viewHeight = document.documentElement.clientHeight;
    this.currentPosition = 0;
    this.startY = undefined;

    this.init();
  }
  getNewPosition() {
    this.viewHeight = document.documentElement.clientHeight;
    this.container.style.height = `${this.viewHeight}px`;
    let activeNavIndex;
    this.navDots.forEach((e, i) => {
      if (e.classList.contains('active')) {
        activeNavIndex = i;
      }
    });
    this.currentPosition = -(activeNavIndex * this.viewHeight);
    this.turnPage(this.currentPosition);
  }
  turnPage(height) {
    this.container.style.top = `${height}px`;
  }
  changeNavStyle(height) {
    if (this.options.isShowNav) {
      this.navDots.forEach(el => {
        utils.deleteClassName(el, 'active');
      });

      const i = -(height / this.viewHeight);
      this.navDots[i].classList.add('active');
    }
  }
  createNav() {
    const nav = document.createElement('div');
    nav.className = 'nav';
    this.container.appendChild(nav);

    for (let i = 0; i < this.pagesNum; i++) {
      nav.innerHTML += '<p class="nav-dot"><span></span></p>';
    }

    const navDots = document.querySelectorAll('.nav-dot');
    this.navDots = Array.prototype.slice.call(navDots);

    this.navDots[0].classList.add('active');

    this.navDots.forEach((el, i) => {
      el.addEventListener('click', () => {
        this.currentPosition = -(i * this.viewHeight);
        this.options.definePages();
        this.turnPage(this.currentPosition);

        this.navDots.forEach(el => {
          utils.deleteClassName(el, 'active');
        });
        el.classList.add('active');
      });
    });
  }
  goUp() {
    if (-this.container.offsetTop >= this.viewHeight) {
      this.currentPosition = this.currentPosition + this.viewHeight;

      this.turnPage(this.currentPosition);
      this.changeNavStyle(this.currentPosition);
      this.options.definePages();
    }
  }
  goDown() {
    if (-this.container.offsetTop <= this.viewHeight * (this.pagesNum - 2)) {
      this.currentPosition = this.currentPosition - this.viewHeight;

      this.turnPage(this.currentPosition);
      this.changeNavStyle(this.currentPosition);

      this.options.definePages();
    }
  }
  scrollMouse(event) {
    const delta = utils.getWheelDelta(event);
    if (delta < 0) {
      this.goDown();
    } else {
      this.goUp();
    }
  }
  touchEnd(event) {
    const endY = event.changedTouches[0].pageY;
    if (endY - this.startY < 0) {
      this.goDown();
    } else {
      this.goUp();
    }
  }
  init() {
    this.container.style.height = `${this.viewHeight}px`;
    if (this.options.isShowNav) {
      this.createNav();
    }

    const handleMouseWheel = utils.debounce(this.scrollMouse.bind(this), 40, true);
    if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
      document.addEventListener('mousewheel', handleMouseWheel);
    } else {
      document.addEventListener('DOMMouseScroll', handleMouseWheel);
    }

    document.addEventListener('touchstart', event => {
      this.startY = event.touches[0].pageY;
    });
    const handleTouchEnd = utils.throttle(this.touchEnd, this, 500);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchmove', event => {
      event.preventDefault();
    });

    const handleNewPosition = utils.debounce(this.getNewPosition.bind(this), 200);
    window.addEventListener('resize', handleNewPosition);
  }
}
