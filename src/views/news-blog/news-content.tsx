// 'use client';

// import React, { useEffect, useState } from 'react';
// import Style from './index.module.css';
// import {
//   Button,
//   Image,
//   Input,
//   Link,
//   LoaderSpinner,
//   Modal
// } from '@akinon/next/components';
// import * as yup from 'yup';
// import emailjs from 'emailjs-com';

// const schema = yup.object().shape({
//   email: yup
//     .string()
//     .email('Please Enter Valid Email')
//     .required('Email is required'),
//   name: yup.string().required('Name is required'),
//   message: yup.string().required('Message is required')
// });

// const NewsContent = ({ data }) => {
//   const [blogId, setBlogId] = useState(null);
//   const [currentUrl, setCurrentUrl] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [popup, setPopup] = useState(false);
//   const mySubject = data.attributes.news_blog.filter(
//     (index) => index.value.id === selectedItem?.value?.id
//   );

//   const subjectTitle = mySubject.length > 0 ? mySubject[0].value?.title : '';

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: '',
//     subject: ''
//   });

//   useEffect(() => {
//     if (!mySubject.length) {
//       setFormData({ ...formData, subject: mySubject[0]?.value?.title });
//     }
//   }, [selectedItem]);

//   const [errors, setErrors] = useState({
//     name: '',
//     email: '',
//     message: ''
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     setCurrentUrl(window.location.href);
//   }, []);

//   useEffect(() => {
//     const searchParams = new URLSearchParams(window.location.search);
//     const idFromURL = searchParams.get('id');
//     setBlogId(idFromURL);
//     const foundItem = data.attributes.news_blog.find(
//       (item) => item.value.id === idFromURL
//     );

//     if (foundItem) {
//       setSelectedItem(foundItem);
//     } else {
//       setSelectedItem(null);
//     }
//   }, [data]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);

//     try {
//       // Validate form data
//       await schema.validate(formData, { abortEarly: false });
//       setErrors({ name: '', email: '', message: '' }); // Clear previous errors

//       // Submit form data
//       const response = await fetch('/api/auth/mail', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert(result.message);
//         setFormData({
//           name: '',
//           email: '',
//           message: '',
//           subject: subjectTitle
//         });
//         setLoading(false);
//       } else {
//         alert(result.error);
//       }
//     } catch (validationErrors) {
//       const newErrors = { name: '', email: '', message: '' };

//       // Check if validationErrors.inner exists
//       if (validationErrors.inner) {
//         validationErrors.inner.forEach((error) => {
//           newErrors[error.path] = error.message;
//         });
//       } else {
//         // Handle cases where validationErrors.inner is not available
//         newErrors[validationErrors.path] = validationErrors.message;
//       }

//       setErrors(newErrors);
//     }
//   };

//   useEffect(() => {
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 2000);
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="main_container_header mb-5">
//         <LoaderSpinner />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="container md_container main_container_header">
//         {selectedItem && (
//           <div className="my-5">
//             <div className="my-5">
//               {selectedItem.value.video_link && (
//                 <iframe
//                   width="100%"
//                   height="550"
//                   src={selectedItem.value.video_link}
//                   title="YouTube video player"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                 ></iframe>
//               )}
//             </div>
//             <h1 className="lg:text-4xl text-2xl text-center text-semibold">
//               {selectedItem.value.title}
//             </h1>
//             <h3
//               className="text-center mt-3"
//               dangerouslySetInnerHTML={{ __html: selectedItem.value.text }}
//             ></h3>

//             <div
//               className={`${Style.news_content} text-lg`}
//               dangerouslySetInnerHTML={{ __html: selectedItem.value.content }}
//             ></div>

//             <div className="flex gap-5 justify-center items-center mt-10 flex-wrap">
//               {selectedItem?.kwargs?.value?.new_images_1?.url && (
//                 <Image
//                   src={selectedItem.kwargs.value.new_images_1.url}
//                   layout="responsive"
//                   className={`${Style.image_news_sub}`}
//                   width={100}
//                   height={100}
//                   alt=""
//                 />
//               )}
//               {/* Repeat similar blocks for new_images_2 to new_images_6 */}
//             </div>
//             <div className="flex gap-2 mt-9 justify-center">
//               <Button className="uppercase border pinkbtn lg:w-2/12 w-4/12 flex items-center gap-3 text-center justify-center">
//                 <Link
//                   className="flex items-center gap-2"
//                   href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//                     `https://74c3f8ed9ff54860ace14bc09ecf0f2c.lb.akinoncloud.com/blog?id=${selectedItem.value.id}`
//                   )}`}
//                   target="_blank"
//                 >
//                   <Image
//                     src="/images/local/facebook-icon.png"
//                     className={`${Style.facebook_image}`}
//                     width={10}
//                     height={10}
//                     alt="Facebook"
//                   />
//                   <span>Share</span>
//                 </Link>
//               </Button>
//               <Button className="uppercase border pinkbtn lg:w-2/12 w-4/12 flex items-center gap-3 text-center justify-center">
//                 <Link
//                   className="flex items-center gap-2"
//                   href={`https://twitter.com/intent/tweet?text=${currentUrl}${selectedItem.value.title}`}
//                 >
//                   <Image
//                     src="/images/local/twitter.png"
//                     className={`${Style.facebook_image}`}
//                     width={10}
//                     height={10}
//                     alt="Facebook"
//                   />
//                   <span>Tweet</span>
//                 </Link>
//               </Button>
//               <Button className="uppercase border pinkbtn lg:w-2/12 w-4/12 flex items-center gap-3 text-center justify-center">
//                 <Link
//                   className="flex items-center gap-2"
//                   href={`https://pinterest.com/pin/create/button/?url=${currentUrl}&media=${selectedItem.kwargs.value.image.url}&description=${selectedItem.value.title}`}
//                 >
//                   <Image
//                     src="/images/local/pinterest.png"
//                     className={`${Style.facebook_image}`}
//                     width={10}
//                     height={10}
//                     alt="Facebook"
//                   />
//                   <span>Pin it</span>
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//       <div className={`${Style.border_line_news}`}></div>

//       {/* <LoaderSpinner /> */}
//       {loading ? (
//         <div className="mb-5">
//           <LoaderSpinner />
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <div className="container md_container">
//             <h2 className="text-2xl">Leave a Feedback</h2>
//             <div className="w-full mt-5 lg:flex-row flex-col flex gap-7">
//               <div className="lg:w-6/12 w-full">
//                 <label className="text-lg">Name</label>
//                 <Input
//                   className="h-14"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   type="text"
//                 ></Input>
//                 {errors.name && (
//                   <span style={{ color: 'red' }}>{errors.name}</span>
//                 )}
//               </div>
//               <div className="lg:w-6/12 w-full">
//                 <label className="text-lg">Email</label>
//                 <Input
//                   className="h-14"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   type="text"
//                 ></Input>
//                 {errors.email && (
//                   <span style={{ color: 'red' }}>{errors.email}</span>
//                 )}
//               </div>
//             </div>
//             <div className="w-full mt-5">
//               <label className="text-lg">Message</label>
//               <Input
//                 className="h-14"
//                 type="textarea"
//                 name="message"
//                 onChange={handleChange}
//                 value={formData.message}
//               ></Input>
//               {errors.message && (
//                 <span style={{ color: 'red' }}>{errors.message}</span>
//               )}
//             </div>
//             <Button className="pinkbtn my-5 px-5" type="submit">
//               {/* {loading ? <LoaderSpinner /> : 'Submit'} */}
//               Submit
//             </Button>
//           </div>
//         </form>
//       )}
//       <Modal
//         portalId="my-profile-modal"
//         open={isModalOpen}
//         setOpen={setIsModalOpen}
//         title={'Success'}

//       >
//         <div className="flex flex-col items-center justify-center gap-6 p-6">
//           <h3 className="text-base" data-testid="account-my-profile-response">
//             {responseMessage.content}
//           </h3>
//           {/* <p className="text-center">{responseMessage.content}</p> */}
//           <Button
//             // onClick={handleModalClick}
//             appearance="outlined"
//             className="font-medium px-10 py-2 pinkbtn"
//           >
//             Email Sent Succesfully
//             {/* {t('account.my_profile.form.close_button')} */}
//           </Button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default NewsContent;

'use client';

import React, { useEffect, useState } from 'react';
import Style from './index.module.css';
import {
  Button,
  Image,
  Input,
  Link,
  LoaderSpinner,
  Modal
} from '@akinon/next/components';
import * as yup from 'yup';
import emailjs from 'emailjs-com';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please Enter Valid Email')
    .required('Email is required'),
  name: yup.string().required('Name is required'),
  message: yup.string().required('Message is required')
});

const NewsContent = ({ data }) => {
  const [blogId, setBlogId] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState({
    content: '',
    success: true
  });
  const mySubject = data.attributes.news_blog.filter(
    (index) => index.value.id === selectedItem?.value?.id
  );

  const subjectTitle = mySubject.length > 0 ? mySubject[0].value?.title : '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: ''
  });

  useEffect(() => {
    if (!mySubject.length) {
      setFormData({ ...formData, subject: mySubject[0]?.value?.title });
    }
  }, [selectedItem]);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromURL = searchParams.get('id');
    setBlogId(idFromURL);
    window.scrollTo(0, 0);
    const foundItem = data.attributes.news_blog.find(
      (item) => item.value.id === idFromURL
    );

    if (foundItem) {
      setSelectedItem(foundItem);
    } else {
      setSelectedItem(null);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      await schema.validate(formData, { abortEarly: false });
      setErrors({ name: '', email: '', message: '' }); // Clear previous errors

      // Submit form data
      const response = await fetch('/api/auth/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        setResponseMessage({
          content: 'Email sent successfully!',
          success: true
        });
        setIsModalOpen(true);
        setFormData({
          name: '',
          email: '',
          message: '',
          subject: subjectTitle
        });
      } else {
        setResponseMessage({
          content: result.error,
          success: false
        });
        setIsModalOpen(true);
      }
    } catch (validationErrors) {
      const newErrors = { name: '', email: '', message: '' };

      if (validationErrors.inner) {
        validationErrors.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
      } else {
        newErrors[validationErrors.path] = validationErrors.message;
      }

      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="main_container_header mb-5">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="container md_container main_container_header">
        {selectedItem && (
          <div className="my-5">
            <div className="my-5">
              {selectedItem.value.video_link && (
                <iframe
                  width="100%"
                  height="550"
                  src={selectedItem.value.video_link}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              )}
            </div>
            <h1 className="lg:text-4xl text-2xl text-center text-semibold">
              {selectedItem.value.title}
            </h1>
            <h3
              className="text-center mt-3"
              dangerouslySetInnerHTML={{ __html: selectedItem.value.text }}
            ></h3>
            <div
              className={`${Style.news_content} text-lg`}
              dangerouslySetInnerHTML={{ __html: selectedItem.value.content }}
            ></div>
            <div className="flex gap-5 justify-center items-center mt-10 flex-wrap">
              {selectedItem?.kwargs?.value?.new_images_1?.url && (
                <Image
                  src={selectedItem.kwargs.value.new_images_1.url}
                  layout="responsive"
                  className={`${Style.image_news_sub}`}
                  width={100}
                  height={100}
                  alt=""
                />
              )}
              {/* Repeat similar blocks for new_images_2 to new_images_6 */}
            </div>
            <div className="flex gap-2 mt-9 justify-center">
              <Button className="uppercase border pinkbtn lg:w-2/12 w-4/12 flex items-center gap-3 text-center justify-center">
                <Link
                  className="flex items-center gap-2"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    `https://74c3f8ed9ff54860ace14bc09ecf0f2c.lb.akinoncloud.com/blog?id=${selectedItem.value.id}`
                  )}`}
                  target="_blank"
                >
                  <Image
                    src="/images/local/facebook-icon.png"
                    className={`${Style.facebook_image}`}
                    width={10}
                    height={10}
                    alt="Facebook"
                  />
                  <span>Share</span>
                </Link>
              </Button>
              <Button className="uppercase border pinkbtn lg:w-2/12 w-4/12 flex items-center gap-3 text-center justify-center">
                <Link
                  className="flex items-center gap-2"
                  href={`https://twitter.com/intent/tweet?text=${currentUrl}${selectedItem.value.title}`}
                >
                  <Image
                    src="/images/local/twitter.png"
                    className={`${Style.facebook_image}`}
                    width={10}
                    height={10}
                    alt="Facebook"
                  />
                  <span>Tweet</span>
                </Link>
              </Button>
              <Button className="uppercase border pinkbtn lg:w-2/12 w-4/12 flex items-center gap-3 text-center justify-center">
                <Link
                  className="flex items-center gap-2"
                  href={`https://pinterest.com/pin/create/button/?url=${currentUrl}&media=${selectedItem.kwargs.value.image.url}&description=${selectedItem.value.title}`}
                >
                  <Image
                    src="/images/local/pinterest.png"
                    className={`${Style.facebook_image}`}
                    width={10}
                    height={10}
                    alt="Facebook"
                  />
                  <span>Pinterest</span>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className={`${Style.border_line_news}`}></div>
      {loading ? (
        <div className="mb-5">
          <LoaderSpinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="container md_container">
            <h2 className="text-2xl">Leave a Feedback</h2>
            <div className="w-full mt-5 lg:flex-row flex-col flex gap-7">
              <div className="lg:w-6/12 w-full">
                <label className="text-lg">
                  Name <span className="text_red">*</span>
                </label>
                <Input
                  className="h-14"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                />
                {errors.name && (
                  <span style={{ color: 'red' }}>{errors.name}</span>
                )}
              </div>
              <div className="lg:w-6/12 w-full">
                <label className="text-lg">
                  Email <span className="text_red">*</span>
                </label>
                <Input
                  className="h-14"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  type="text"
                />
                {errors.email && (
                  <span style={{ color: 'red' }}>{errors.email}</span>
                )}
              </div>
            </div>
            <div className="w-full mt-5">
              <label className="text-lg">
                Message <span className="text_red">*</span>
              </label>
              <Input
                className="h-14"
                type="textarea"
                name="message"
                onChange={handleChange}
                value={formData.message}
              />
              {errors.message && (
                <span style={{ color: 'red' }}>{errors.message}</span>
              )}
            </div>
            <Button className="pinkbtn my-5 px-5" type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}

      <Modal
        portalId="my-profile-modal"
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title={responseMessage.success ? 'Success' : 'Error'}
      >
        <div className="flex flex-col items-center justify-center gap-6 p-6">
          <h3 className="text-base" data-testid="account-my-profile-response">
            {responseMessage.content}
          </h3>
          <Button
            onClick={() => setIsModalOpen(false)}
            appearance="outlined"
            className="font-medium px-10 py-2 pinkbtn"
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default NewsContent;
