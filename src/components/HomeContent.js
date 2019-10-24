import React from 'react'
import { Link } from 'react-router-dom'
export default function HomeContent() {
  return (
    <section className="container">
        <div className="columns features">
            <div className="column is-4">
                <div className="card is-shady">
                    <div className="card-content">
                        <div className="content">
                            <h4>audit mee</h4>
                            <p>Lorem cupidatat officia excepteur veniam proident eiusmod minim aliquip culpa. Cupidatat duis fugiat exercitation anim exercitation incididunt id eiusmod non nulla pariatur. Culpa pariatur laborum ad occaecat aliquip nostrud ex id. Qui Lorem nulla excepteur et do non pariatur ullamco proident id do. Fugiat enim quis nulla adipisicing dolor ea pariatur esse eu.</p>
                            <p><Link to="/">Learn more</Link></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="column is-4">
                <div className="card is-shady">
                    <div className="card-content">
                        <div className="content">
                            <h4>audit audit</h4>
                            <p>Sunt culpa consectetur consectetur eiusmod proident aliqua laboris sit elit irure ea exercitation fugiat. Exercitation tempor consequat culpa magna laborum sint reprehenderit sunt do fugiat exercitation ea sunt est. Aute voluptate labore ad irure consequat. Et laboris quis laboris excepteur deserunt ipsum. Sit non adipisicing et ex laborum ullamco. Magna nostrud mollit Lorem velit laborum consequat ad. Nostrud Lorem laboris culpa amet commodo excepteur proident enim quis est amet.
                            </p>
                            <p><Link to="/">Learn more</Link></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="column is-4">
                <div className="card is-shady">
                     <div className="card-content">
                        <div className="content">
                            <h4>audited</h4>
                            <p>Nisi irure dolor quis dolor mollit sint aute culpa anim aliquip amet officia mollit. Reprehenderit eu eiusmod deserunt ut duis ea ad do. Labore dolor adipisicing nostrud officia commodo cupidatat tempor nostrud laboris. Reprehenderit tempor incididunt quis sunt ipsum sit fugiat mollit magna sunt irure nisi. Dolor sunt ullamco aliquip dolor sunt elit veniam. Commodo veniam sint dolore ipsum ex cillum velit aliqua. Incididunt ut cupidatat amet in dolore et excepteur amet.</p>
                            <p><Link to="/">Learn more</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}
