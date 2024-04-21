<script>
import { isOpen } from '../lib/store.js';

export let userProfilePage
export let userProfileImage

// Set the store to true when the button is clicked
function openMenu() {
      //console.log('button clicked') // DEBUG
      isOpen.set(!isOpen.get());
}

isOpen.subscribe(open => {
      if (open) {
            document.getElementById('drawerMenu').style.display = 'block';
            document.getElementById('drawerMenu').classList.add('fade-in');
            //console.log('menu open') // DEBUG
      } else {
            document.getElementById('drawerMenu').classList.remove('fade-in');
            document.getElementById('drawerMenu').style.display = 'none';
            //console.log('menu closed') // DEBUG
      }
})

// Add an event listener to the button
//document.getElementById('drawerMenu').addEventListener('click', openMenu)
//
// moved this functionality to svelte on:click fn below
</script>

<style>
.ham {
      float: right;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: transform 250ms;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
}
.hamRotate.active {
      transform: rotate(45deg);
}
.hamRotate180.active {
      transform: rotate(180deg);
}
.line {
      fill:none;
      transition: stroke-dasharray 250ms, stroke-dashoffset 250ms;
      stroke:#3880a1;
      stroke-width:5.5;
      stroke-linecap:round;
}
.ham1 .top {
      stroke-dasharray: 40 139;
}
.ham1 .bottom {
      stroke-dasharray: 40 180;
}
.ham1.active .top {
      stroke-dashoffset: -98px;
}
.ham1.active .bottom {
      stroke-dashoffset: -138px;
}
</style>

<div style="width: 110px;">
      <div style="float: left; line-height: 60px; height: 60px">
            <a href="/@{ userProfilePage }">
                  <img src="{ userProfileImage }" style="display: inline; width: 50px; height: 50px; border-radius: 50px; object-fit: cover;" alt="user icon">
            </a>
      </div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div id="hamburgerMenu" on:click={ openMenu } style="float: left; line-height: 50px; height: 50px; padding-top: 10px; padding-left: 10px;">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <svg class="ham hamRotate ham1 {$isOpen ? 'active' : ''}" viewBox="0 0 100 100" width="45" style="display: inline;">
                  <path
                        class="line top"
                        d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40" />

                  <path
                        class="line middle"
                        d="m 30,50 h 40" />

                  <path
                        class="line bottom"
                        d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40" />
            </svg>
      </div>
</div>