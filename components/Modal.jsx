import { Fragment, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import { Dialog, Transition } from '@headlessui/react'
import { CameraIcon } from '@heroicons/react/outline'
import { db, storage } from '../firebase'
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc
} from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { ref, getDownloadURL, uploadString } from '@firebase/storage'

function Modal() {
  // FIREBASE SECTION
  const { data: session } = useSession()
  //handling loading and multiple clicks
  const [loading, setLoading] = useState(false)
  // ---------------------------

  const [open, setOpen] = useRecoilState(modalState)
  //caption ref for caption
  const captionRef = useRef(null)
  //for uploading files
  const filePickerRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  // uploading files to insta
  const addImageToPost = (e) => {
    const reader = new FileReader()
    //select the data user selects
    if (e.target.files[0]) {
      //this fire off the reader.onload when the reading of file is done, we get the file in object,  so we can save it in state
      reader.readAsDataURL(e.target.files[0])
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result)
    }
  }

  //firebase:- we upload it to db then we create a post id and from that post id we pull the post into the app

  const uploadPost = async () => {
    // firebase:- so that user does not click multiple time on the button to upload, i will disable it
    if (loading) return

    setLoading(true)
    // 1) create a post and add to firestore 'posts' collection
    //2) get the post ID for the newly created post
    //3) upload the image to firebase storage with the post ID
    //4) get a download URL from firebase storage and update the original posts with image

    // addDoc is a function in firebase to add documents
    //part 1
    const docRef = await addDoc(collection(db, 'posts'), {
      username: session.user.username,
      caption: captionRef.current.value,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    })

    //part 2
    console.log('new doc added with id', docRef.id)

    //gives reference to firebase storage
    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    //part 3
    await uploadString(imageRef, selectedFile, 'data_url').then(
      async snapshot => {
        const downloadURL = await getDownloadURL(imageRef)
        //part 4
        await updateDoc(doc(db, 'posts', docRef.id), {
          image: downloadURL,
        });
      }
    );
// after everything we reset to null
    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex min-h-[800px] items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:min-h-screen sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duation-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opcacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="translate-opacity fixed inset-0 bg-gray-500 bg-opacity-75" />
          </Transition.Child>
          {/* this element is to track the browser into centering the modal contents */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            area-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 "
          >
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
              <div>
                {/* if their was a selected fie then do this or that */}
                {selectedFile ? (
                  // if file is selected it is shown on the screen instead of cam icon
                  <img
                    src={selectedFile}
                    className="w-full cursor-pointer object-contain"
                    onClick={() => setSelectedFile(null)}
                    alt=""
                  />
                ) : (
                  //if file is not selected to upload cam icon is visible
                  <div
                    onClick={() => filePickerRef.current.click()}
                    className="mx-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-100"
                  >
                    <CameraIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                )}

                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Upload a photo
                    </Dialog.Title>
                    <div>
                      <input
                        ref={filePickerRef}
                        type="file"
                        hidden
                        onChange={addImageToPost}
                      />
                    </div>
                    <div className="mt-2">
                      <input
                        type="text"
                        className="w-full border-none text-center focus:ring-0"
                        ref={captionRef}
                        placeholder="Please enter a caption..."
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    disabled = {!selectedFile} // if file not selected
                    className="disabled: inline-flex w-full cursor-not-allowed justify-center rounded-md border border-transparent bg-red-600
                    px-4 py-2 text-base font-medium text-white
                    shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                    disabled:bg-gray-300 hover:disabled:bg-gray-300 sm:text-sm
                    "
                    onClick={uploadPost}
                  >
                    {loading ? "Uploading..." : "Upload Post"}
                  </button>
                </div>
              </div>
            </div>
            {/* </div> */}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
