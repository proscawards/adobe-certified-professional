const NUMBER_MAP = {
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six"
};

const ACTIVE_ACCORDION = 'active-accordion';

/**
 * Generate a random salt per browser session
 */
const SALT = Math.random().toString(36).slice(-5);

/**
 * Scroll to the section on click
 * @param event e 
 */
function scrollToSection(e)
{
    if (e.target.classList.contains('navBtn')) {
        let attr = e.target.getAttribute('data-target');
        try {
            if (e.target.classList.contains('active')) {
                e.target.classList.remove('active');
                document.getElementById(`${attr}Btn`).classList.add('collapsed');
                document.getElementById(`${attr}Btn`).classList.remove('show');
                document.getElementById(`${attr}Btn`).setAttribute('aria-expanded', false);
                document.getElementById(`${attr}Cont`).classList.remove('show');
                updateLatestActiveAccordion(-1);
            } else {
                document.querySelectorAll('.navBtn').forEach(item => {
                    item.classList.remove('active');
                })
                e.target.classList.add('active');
                document.getElementById(attr).scrollIntoView();
                document.querySelectorAll('.accordion-button').forEach(item => {
                    item.classList.add('collapsed');
                    item.classList.remove('show');
                    item.setAttribute('aria-expanded', false);
                    let cont = item.getAttribute('data-bs-target');
                    document.querySelector(cont).classList.remove('show');
                })
                document.getElementById(`${attr}Btn`).classList.remove('collapsed');
                document.getElementById(`${attr}Btn`).classList.add('show');
                document.getElementById(`${attr}Btn`).setAttribute('aria-expanded', true);
                document.getElementById(`${attr}Cont`).classList.add('show');
                updateLatestActiveAccordion(Object.keys(NUMBER_MAP).find(key => NUMBER_MAP[key] === attr.replace('section', '')));
            }
        } catch (error) {
            // console.error(error);
        }
    }
}//end scrollToSection()

/**
 * Scroll to the section on keydown
 * @param string sectionNo 
 */
 function scrollToSectionByKey(sectionNo)
 {
    try {
        let target = document.getElementById(`navBtn${sectionNo}`);
        let attr = target.getAttribute('data-target');
        if (target.classList.contains('active')) {
            target.classList.remove('active');
            document.getElementById(`section${sectionNo}Btn`).classList.add('collapsed');
            document.getElementById(`section${sectionNo}Btn`).classList.remove('show');
            document.getElementById(`section${sectionNo}Btn`).setAttribute('aria-expanded', false);
            document.getElementById(`section${sectionNo}Cont`).classList.remove('show');
            updateLatestActiveAccordion(-1);
        } else {
            document.querySelectorAll('.navBtn').forEach(item => {
                item.classList.remove('active');
            })
            target.classList.add('active');
            document.getElementById(attr).scrollIntoView();
            document.querySelectorAll('.accordion-button').forEach(item => {
                item.classList.add('collapsed');
                item.classList.remove('show');
                item.setAttribute('aria-expanded', false);
                let cont = item.getAttribute('data-bs-target');
                document.querySelector(cont).classList.remove('show');
            })
            document.getElementById(`section${sectionNo}Btn`).classList.remove('collapsed');
            document.getElementById(`section${sectionNo}Btn`).classList.add('show');
            document.getElementById(`section${sectionNo}Btn`).setAttribute('aria-expanded', true);
            document.getElementById(`section${sectionNo}Cont`).classList.add('show');
            updateLatestActiveAccordion(Object.keys(NUMBER_MAP).find(key => NUMBER_MAP[key] === sectionNo));
        }
    } catch (error) {
        // console.error(error);
    }
}//end scrollToSectionByKey()

/**
 * Update active nav button based on clicked accordion
 * @param event e 
 */
function updateActiveAccordion(e)
{
    try {
        let attr = e.target.getAttribute('data-nav-btn');
        document.querySelectorAll('.navBtn').forEach(item => {
            item.classList.remove('active');
        })
        let isActive = e.target.classList.contains('collapsed') ? false : true;
        if (isActive) {
            document.getElementById(attr).classList.add('active');
            updateLatestActiveAccordion(Object.keys(NUMBER_MAP).find(key => NUMBER_MAP[key] === attr.replace('navBtn', '')));
        } else {
            updateLatestActiveAccordion(-1);
        }
    } catch (error) {
        // console.error(error);
    }

}//end updateActiveAccordion()

/**
 * Update local storage with the latest active accordion index
 * @param number index 
 */
function updateLatestActiveAccordion(index)
{
    localStorage.setItem(ACTIVE_ACCORDION, btoa(`${index}_${SALT}`));
}//end updateLatestActiveAccordion()

/**
 * Retrieve the previous active accordion index
 * @returns
 */
function loadPreviousActiveAccordion()
{
    return atob(localStorage.getItem(ACTIVE_ACCORDION)).charAt(0);
}//end loadPreviousActiveAccordion()

document.addEventListener('keydown', function(e) {
    let name = e.key;
    if (Object.keys(NUMBER_MAP).includes(name)) {
        let nameStr = NUMBER_MAP[name];
        scrollToSectionByKey(nameStr);
    }
});

document.addEventListener("DOMContentLoaded", function(e) {
    let index = loadPreviousActiveAccordion();
    if (Object.keys(NUMBER_MAP).includes(index)) {
        let nameStr = NUMBER_MAP[index];
        updateLatestActiveAccordion(index);
        scrollToSectionByKey(nameStr);
    }
});