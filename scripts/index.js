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
                document.getElementById(`${attr}Btn`).classList.remove('show');
                document.getElementById(`${attr}Btn`).setAttribute('aria-expanded', false);
                document.getElementById(`${attr}Cont`).classList.remove('show');
            } else {
                document.querySelectorAll('.navBtn').forEach(item => {
                    item.classList.remove('active');
                })
                e.target.classList.add('active');
                document.getElementById(attr).scrollIntoView();
                document.querySelectorAll('.accordion-button').forEach(item => {
                    item.classList.remove('show');
                    item.setAttribute('aria-expanded', false);
                    let cont = item.getAttribute('data-bs-target');
                    document.querySelector(cont).classList.remove('show');
                })
                document.getElementById(`${attr}Btn`).classList.add('show');
                document.getElementById(`${attr}Btn`).setAttribute('aria-expanded', true);
                document.getElementById(`${attr}Cont`).classList.add('show');
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
            document.getElementById(`section${sectionNo}Btn`).classList.remove('show');
            document.getElementById(`section${sectionNo}Btn`).setAttribute('aria-expanded', false);
            document.getElementById(`section${sectionNo}Cont`).classList.remove('show');
        } else {
            document.querySelectorAll('.navBtn').forEach(item => {
                item.classList.remove('active');
            })
            target.classList.add('active');
            document.getElementById(attr).scrollIntoView();
            document.querySelectorAll('.accordion-button').forEach(item => {
                item.classList.remove('show');
                item.setAttribute('aria-expanded', false);
                let cont = item.getAttribute('data-bs-target');
                document.querySelector(cont).classList.remove('show');
            })
            document.getElementById(`section${sectionNo}Btn`).classList.add('show');
            document.getElementById(`section${sectionNo}Btn`).setAttribute('aria-expanded', true);
            document.getElementById(`section${sectionNo}Cont`).classList.add('show');
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
        }
    } catch (error) {
        // console.error(error);
    }

}//end updateActiveAccordion()

const NUMBER_MAP = {
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six"
};

document.addEventListener('keydown', function(e) {
    let name = e.key;
    let nameStr = NUMBER_MAP[name];
    scrollToSectionByKey(nameStr);
});

document.querySelectorAll('.accordion-button').forEach((btn) => {
    btn.onclick
})