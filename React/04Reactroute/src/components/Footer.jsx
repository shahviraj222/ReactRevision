// The Footer element common for all page
import React from 'react';

function Footer(props) {
    return (
        <footer
          class="flex flex-col items-center bg-zinc-50 text-center text-surface dark:bg-neutral-700 dark:text-white lg:text-left">
          <div class="container p-6">
            <div class="grid gap-4 lg:grid-cols-2">
              <div class="mb-6 md:mb-0">
                <h5 class="mb-2 font-medium uppercase">Footer text</h5>
        
                <p class="mb-4">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste
                  atque ea quis molestias. Fugiat pariatur maxime quis culpa
                  corporis vitae repudiandae aliquam voluptatem veniam, est atque
                  cumque eum delectus sint!
                </p>
              </div>
        
              <div class="mb-6 md:mb-0">
                <h5 class="mb-2 font-medium uppercase">Footer text</h5>
        
                <p class="mb-4">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste
                  atque ea quis molestias. Fugiat pariatur maxime quis culpa
                  corporis vitae repudiandae aliquam voluptatem veniam, est atque
                  cumque eum delectus sint!
                </p>
              </div>
            </div>
          </div>
    
          <div class="w-full bg-black/5 p-4 text-center">
            © 2023 Copyright:
            <a href="https://tw-elements.com/">TW Elements</a>
          </div>
        </footer>
    );
}

export default Footer;