// Array of Course Objects for Web & Computer Programming Certificate
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the students to programming and problem solving. It covers variables, conditionals, loops, functions, and simple data structures using Python.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course focuses on using HTML5 and CSS3 to design and develop responsive web pages.',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities. Students write and test Python programs.',
        technology: ['Python', 'Testing', 'Functions'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces the concepts of object-oriented programming to students with a foundation in procedural programming. It emphasizes classes, encapsulation, inheritance, and polymorphism.',
        technology: ['C#', 'OOP'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Students learn to create dynamic websites that use JavaScript to respond to user events, manipulate the DOM, validate forms, and format content dynamically.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'ITM',
        number: 111,
        title: 'Introduction to Information Technology',
        credits: 3,
        certificate: 'Web and Computer Programming / Applied Technology',
        description: 'This course introduces students to information technology concepts, database management systems, SQL queries, networking fundamentals, and cloud computing principles.',
        technology: ['Database', 'SQL', 'Networking', 'Cloud'],
        completed: false
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course focuses on user experience, accessibility, compliance, performance optimization, asynchronous JavaScript, Fetch API, and responsive web component design.',
        technology: ['HTML', 'CSS', 'JavaScript', 'APIs', 'JSON'],
        completed: false
    }
];

function initCourses() {
    const coursesContainer = document.getElementById('courses-container');
    const totalCreditsEl = document.getElementById('total-credits');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseDialog = document.getElementById('course-dialog');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogSubject = document.getElementById('dialog-subject');
    const dialogTitleName = document.getElementById('dialog-title-name');
    const dialogCredits = document.getElementById('dialog-credits');
    const dialogCert = document.getElementById('dialog-cert');
    const dialogDescription = document.getElementById('dialog-desc');
    const dialogTech = document.getElementById('dialog-tech');
    const closeDialogBtn = document.getElementById('close-dialog');

    // Render Courses to DOM
    function renderCourses(filteredCourses) {
        if (!coursesContainer) return;
        
        coursesContainer.innerHTML = '';
        
        filteredCourses.forEach(course => {
            const card = document.createElement('div');
            card.classList.add('course-card');
            card.classList.add(course.completed ? 'completed' : 'pending');
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `${course.subject} ${course.number}: ${course.title}`);
            
            card.textContent = `${course.subject} ${course.number}`;
            
            // Open modal on click
            card.addEventListener('click', () => displayCourseDetails(course));
            
            // Open modal on Enter / Space key for keyboard accessibility
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    displayCourseDetails(course);
                }
            });
            
            coursesContainer.appendChild(card);
        });

        // Update total credits dynamically using reduce
        updateTotalCredits(filteredCourses);
    }

    // Calculate and Display Total Credits using Array.reduce
    function updateTotalCredits(courseList) {
        if (!totalCreditsEl) return;
        const total = courseList.reduce((acc, currentCourse) => acc + currentCourse.credits, 0);
        totalCreditsEl.textContent = total;
    }

    // Display Course Modal Dialog
    function displayCourseDetails(course) {
        if (!courseDialog) return;
        
        if (dialogTitle) dialogTitle.textContent = `${course.subject} ${course.number}`;
        if (dialogSubject) dialogSubject.textContent = course.subject;
        if (dialogTitleName) dialogTitleName.textContent = course.title;
        if (dialogCredits) dialogCredits.textContent = course.credits;
        if (dialogCert) dialogCert.textContent = course.certificate;
        if (dialogDescription) dialogDescription.textContent = course.description;
        
        // Clear and render tech badges
        if (dialogTech) {
            dialogTech.innerHTML = '';
            course.technology.forEach(tech => {
                const badge = document.createElement('span');
                badge.classList.add('dialog-tag');
                badge.textContent = tech;
                dialogTech.appendChild(badge);
            });
        }

        // Show modal dialog
        if (typeof courseDialog.showModal === 'function') {
            courseDialog.showModal();
        } else {
            courseDialog.setAttribute('open', '');
        }
    }

    // Filter Courses by Subject
    function filterCourses(subject) {
        let filtered = [];
        if (subject === 'all') {
            filtered = courses;
        } else {
            filtered = courses.filter(course => course.subject.toLowerCase() === subject.toLowerCase());
        }
        renderCourses(filtered);
    }

    // Event Listeners for Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            filterCourses(filterValue);
        });
    });

    // Close Dialog Event Handlers
    if (closeDialogBtn && courseDialog) {
        closeDialogBtn.addEventListener('click', () => {
            if (typeof courseDialog.close === 'function') {
                courseDialog.close();
            } else {
                courseDialog.removeAttribute('open');
            }
        });
    }

    // Close Dialog on clicking backdrop
    if (courseDialog) {
        courseDialog.addEventListener('click', (event) => {
            const rect = courseDialog.getBoundingClientRect();
            const isInDialog = (
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                if (typeof courseDialog.close === 'function') {
                    courseDialog.close();
                } else {
                    courseDialog.removeAttribute('open');
                }
            }
        });
    }

    // Initial Render
    renderCourses(courses);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCourses);
} else {
    initCourses();
}
