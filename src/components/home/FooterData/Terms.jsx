import React, { useRef } from 'react';
import MaxWidthWrapper from '../../../component/MaxWidthWrapper';
import {Link} from 'react-router-dom'
const TermsAndConditions = () => {
    const scopeRef = useRef(null);
    const definitionsRef = useRef(null);
    const registrationRef = useRef(null);
    const accessRef = useRef(null);
    const auctionsRef = useRef(null);
    const salesRef = useRef(null);
    const transportRef = useRef(null);
    const vehicleInfoRef = useRef(null);
    const warrantyRef = useRef(null);
    const conformityRef = useRef(null);
    const liabilityRef = useRef(null);
    const blockingRef = useRef(null);
    const invoicingRef = useRef(null);
    const privacyRef = useRef(null);
    const variationsRef = useRef(null);
    const miscellaneousRef = useRef(null);

    return (
        <MaxWidthWrapper>

       
        
<div className="py-10 sm:py-16 lg:py-24">

<div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
    
    <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold leading-tight text-richblue-200 sm:text-4xl lg:text-5xl">
         Terms and Conditions
        </h2>

    </div>
            {/* Index */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4">Index</h1>
                <ol className="list-decimal ml-6 space-y-2">
                    <li><a href="#scope" className="text-blue-600 hover:underline">Scope</a></li>
                    <li><a href="#definitions" className="text-blue-600 hover:underline">Definitions</a></li>
                    <li><a href="#registration" className="text-blue-600 hover:underline">Platform Registration</a></li>
                    <li><a href="#access" className="text-blue-600 hover:underline">Platform Access and Use</a></li>
                    <li><a href="#auctions" className="text-blue-600 hover:underline">Auctions and Offers</a></li>
                    <li><a href="#sales" className="text-blue-600 hover:underline">nationwide-motors USA Sales</a></li>
                            <li><a href="#transport" className="text-blue-600 hover:underline">Transport and Delivery of Vehicles and Vehicle Documents</a></li>
                            <li><a href="#vehicleInfo" className="text-blue-600 hover:underline">Vehicle Information</a></li>
                            <li><a href="#warranty" className="text-blue-600 hover:underline">Limited Warranty</a></li>
                            <li><a href="#conformity" className="text-blue-600 hover:underline">Conformity and Complaints</a></li>
                            <li><a href="#liability" className="text-blue-600 hover:underline">Liability</a></li>
                            <li><a href="#blocking" className="text-blue-600 hover:underline">Blocking and Cancellations</a></li>
                            <li><a href="#invoicing" className="text-blue-600 hover:underline">Invoicing and Payment</a></li>
                            <li><a href="#privacy" className="text-blue-600 hover:underline">Privacy Policy</a></li>
                            <li><a href="#variations" className="text-blue-600 hover:underline">Variations</a></li>
                            <li><a href="#miscellaneous" className="text-blue-600 hover:underline">Miscellaneous</a></li>
                        </ol>
                    </div>

                    {/* Sections */}
                    <section ref={scopeRef} id="scope" className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">1. Scope</h2>
                        <p>1.1 Bid Drive USA NV has developed a Platform for the re-marketing of vehicles whereby leasing companies, car manufacturers, other companies, and natural persons acting for professional purposes or not can advertise Vehicles they wish to sell, and professional and recognised car dealers can submit an Offer for the purchase of Vehicles.</p>
                        <p>1.2 These Terms and Conditions govern the relation between Bid Drive USA and Buyer in relation to Buyer's use of the Platform and in relation to the offering, sale, and delivery of all Vehicles from or on behalf of Bid Drive USA to Buyer. By agreeing to these Terms and Conditions, buyers also accept all policies and additional terms posted on our site, including, and not limited to, our Claims Policy and FAQ section.</p>
                        <p>1.3 Registration for the Platform and any access or use of the Platform, including making an Offer in relation to any Vehicle, shall qualify as unconditional acceptance by Buyer of these Terms and Conditions.</p>
                        <p>1.4 Buyer agrees to waive its own general and special terms and conditions, even where it is stated therein that only those conditions may apply, and even if such terms and conditions were not protested by Bid Drive USA.</p>
                        <p>1.5 These Terms and Conditions constitute the entire understanding between Bid Drive USA and Buyer with respect to the subject matter hereof, and supersede all prior representations, negotiations, understandings, agreements, and undertakings, whether written or oral, with respect to the subject matter hereof.</p>
                        <p>1.6 Buyer expressly acknowledges having read, understood, and agreed with all the present terms and conditions. Specifically, Buyer is in agreement with the principles regarding Vehicle Information, warranty, conformity, and complaints and liability as set out in clauses 8 to 11 of these Terms and Conditions.</p>
                        <p>1.7 In relation to Bid Drive USA Sales, these Terms and Conditions operate as a framework governing each Bid Drive USA Sale. Each Bid Drive USA Sale shall be deemed to constitute a separate agreement between Bid Drive USA and Buyer, and each such Bid Drive USA Sale shall be subject to these Terms and Conditions.</p>

                    </section>

                    <section ref={definitionsRef} id="definitions" className="mb-8">
                        <h2 className="text-xl font-bold mb-2">2. Definitions</h2>
                        <p className="mb-2">In these Terms and Conditions, the following terms and expressions shall have the following meanings:</p>

                        <dl className="space-y-4">
                            <div>
                        <dt className="font-semibold">Affiliate:</dt>
                        <dd>with respect to a Party, any other company or person that, directly or indirectly, Controls or is Controlled by or is under common Control with such company;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Auction:</dt>
                        <dd>the process described in clause 5.1;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Auction Closing:</dt>
                        <dd>the date and time from which the Buyer Community can no longer submit Buyer Community Offers in relation to an Auction, as specified for each Auction on the Platform;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Auction Fees:</dt>
                        <dd>the administrative fee payable by Buyer for each Vehicle purchased via the Platform;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Auction Rules:</dt>
                        <dd>means the specific rules that may apply to an Auction, as specified on the Platform for each Auction. Such Auction Rules may relate to, by way of example and without limitation, the minimum amount below which no offers are admissible and/or the visibility of Buyer's Offer to other members of the Buyer Community;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Working Day:</dt>
                        <dd>any day that is not a Saturday, Sunday or public holiday in the country of establishment of Bid Drive;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Buyer:</dt>
                        <dd>the natural person or legal entity who is registered for use of the Platform, as identified in the Registration Form;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Buyer Community:</dt>
                        <dd>the Buyer and any other buyers registered on the Platform;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Buyer Community Offers:</dt>
                        <dd>has the meaning given to it in clause 5.1.2;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Control:</dt>
                        <dd>has the meaning given to it in article 5 of the Belgian Companies Code;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Bid Drive:</dt>
                        <dd>Bid Drive NV or its Affiliate, as specified in the Registration Form in accordance with clause 3.4;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Sale Confirmation:</dt>
                        <dd>has the meaning given to it in clause 6.1.2;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Bid Drive Vehicle Description:</dt>
                        <dd>means the description of the Vehicle provided by Bid Drive during the Auction;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Country Fees:</dt>
                        <dd>the administrative and logistics fee payable by Buyer for each Vehicle purchased via the Platform, depending on the country where the Seller offers the Vehicle for sale and the country in which Buyer is established;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Bid Drive NV:</dt>
                        <dd>USAan Car Auction and Distribution Solutions NV/SA, with registered office at Grijpenlaan 19A, 3300 Tienen, Belgium, with company number 0867.129.223; VAT BE0867129223;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">E-Invoice:</dt>
                        <dd>an invoice which has been issued and sent in an electronic format as chosen by Bid Drive. This is the legal form of invoice sent by Bid Drive;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Export:</dt>
                        <dd>a supply of goods that are delivered and carried outside of the USAan Union;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Export Documents:</dt>
                        <dd>all duly and fully completed documents required in relation to, and necessary to prove the transport of the Vehicle in case of Export;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Evidence:</dt>
                        <dd>all documentation necessary to prove something (i.e., but not limited to: Transport Documents, Export Documents, transporter stamped and signed documentation to prove the dispatch and/or transport of the Vehicle from one place to another);</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Intra-Community Supply:</dt>
                        <dd>a supply of goods transported by or on behalf of the supplier or the person to whom the supply is made from one EU Member State to another;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Losses:</dt>
                        <dd>any damage, loss, claim, demand, damage claimed by third parties, cost, tax, or expense of whatever nature;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Means of Access:</dt>
                        <dd>user ID, password, and such other access means as may be required to access and use the Platform;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Offer:</dt>
                        <dd>the offer submitted by Buyer via the Platform for the purchase of one or more Vehicles as detailed in clause 5.1.2;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Offered Price:</dt>
                        <dd>has the meaning given to it in clause 5.2.1;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Order Completion:</dt>
                        <dd>has the meaning given to it in clause 6.1.2;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Party:</dt>
                        <dd>Bid Drive and/or Buyer, as applicable;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Platform:</dt>
                        <dd>the online platform operated by Bid Drive NV via which Buyer can submit Offers for the purchase of Vehicles, accessible via www.nationwide-motors.com or such other URL as Bid Drive may inform Buyer of from time to time or via the mobile app, available for Android and iOS;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Pickup Authorization:</dt>
                        <dd>Documentation that gives a person permission to collect a Vehicle;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Purchase Price:</dt>
                        <dd>in relation to each Bid Drive Sale, the Offered Price, the Auction Fees for all Vehicles, the Country Fees for all Vehicles, the Seller Fees for all Vehicles and the Transport Fees, increased with all applicable Taxes;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Registration Form:</dt>
                        <dd>the form duly completed by Buyer during the registration process for the Platform, including a valid VAT number, proof of business registration, and copy of ID of the owner/manager of the registered company;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Seller:</dt>
                        <dd>any leasing company, car manufacturer, other company, and/or natural person acting for professional purposes or not advertising Vehicles on the Platform;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Seller Fees:</dt>
                        <dd>the administrative fee applicable for specific sellers and payable by Buyer for each Vehicle purchased via the Platform;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Taxes:</dt>
                        <dd>all forms of taxation, value added taxes, withholdings, (import and/or export) duties, imposts, levies, and rates imposed by any local, municipal, governmental, state, federal, or other body and any interest, penalty, surcharge or fine in connection therewith;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Terms and Conditions:</dt>
                        <dd>these Bid Drive terms and conditions;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Transport Documents:</dt>
                        <dd>all duly and fully completed transport documents required in relation to, and necessary to prove the transport of the Vehicle from one place to another;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Transport Fees:</dt>
                        <dd>the amount payable by Buyer for transport of the Vehicles;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Triangulation Scheme:</dt>
                        <dd>a chain transaction between three parties located in three different EU Member States (A-B-C) where the goods/Vehicles are shipped directly from the first Member State (A) to the last (C);</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Vehicle:</dt>
                        <dd>the car or other vehicles offered for sale through the Platform;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">VAT:</dt>
                        <dd>value added tax or any equivalent tax in the relevant territory;</dd>
                    </div>

                    <div>
                        <dt className="font-semibold">Website:</dt>
                        <dd>www.nationwide-motors.com or any other URL operated by Bid Drive;</dd>
                    </div>
                </dl>

            </section>



            <section ref={registrationRef} id="registration" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">3. Platform Registration</h2>
                <p className="mb-4">
                    3.1 The Platform is exclusively available for and may only be used by professional and recognised car dealers duly registered.
                </p>

                <p className="mb-4">
                    3.2 To be authorized to access and use the Platform, Buyer must request confirmation of registration by duly completing the Registration Form and sending all required documents in accordance with the registration modalities described on the Platform, and by accepting these Terms and Conditions.
                </p>

                <p className="mb-4">
                    3.3 The person completing and submitting the Registration Form, and accepting these Terms and Conditions on behalf of Buyer represents and warrants having the necessary powers to legally commit the Buyer.
                </p>

                <p className="mb-4">
                    3.4 Depending on the registered office of the Buyer, and subject to the applicable VAT regulations, Buyer may be offered the possibility to choose from which member of Bid Drive USA it wishes to receive invoices under these Terms and Conditions. If Buyer is:
                </p>

                <p className="ml-6 mb-4">
                    3.4.1 offered this possibility, for the purposes of these Terms and Conditions, Bid Drive USA shall be the member of Bid Drive USA chosen by Buyer and such entity shall be Buyer's sole contracting party for any dealings between the Parties governed by these Terms and Conditions and shall be the entity invoicing Buyer. If Buyer wishes to subsequently modify its choice, such modification shall be subject to Bid Drive USA's prior approval; and
                </p>

                <p className="ml-6 mb-4">
                    3.4.2 not offered this possibility, for the purposes of these Terms and Conditions Bid Drive USA shall be Bid Drive USA NV, and Bid Drive USA NV shall be Buyer's sole contracting party for any dealings between the Parties governed by these Terms and Conditions and shall be the entity invoicing Buyer.
                </p>

                <p className="ml-6 mb-4">
                    3.4.3 Bid Drive USA might decide, without justification or advance notice, to invoice from Bid Drive USA NV location or from the country where the Buyer is registered. Such change shall not open the right to any type of claim or cancellation;
                </p>

                <p className="mb-4">
                    3.5 Buyer guarantees that all information and/or documents provided are correct, complete and valid. Buyer shall promptly notify Bid Drive USA of any changes in the information mentioned in the Registration Form and/or documents submitted under clause 3.2. Notwithstanding clause 3.6, Buyer acknowledges and accepts that Bid Drive USA bears no liability regarding verification of the information and documentation provided by Buyer.
                </p>

                <p className="mb-4">
                    3.6 Bid Drive USA has at any time (before or after confirmation of Buyer's registration) the right to verify the accuracy of the information contained in the Registration Form and/or the validity of the documents submitted by Buyer under clause 3.2. If such verification reveals any inaccuracy of information and/or any invalidity of documentation, without prejudice to its other rights and remedies under these Terms and Conditions or otherwise, Bid Drive USA reserves the right to:
                </p>

                <p className="ml-6 mb-4">
                    3.6.1 reject Buyer's request for registration. Bid Drive USA will inform Buyer of such rejection and may, in its sole discretion, determine to provide Buyer with the opportunity to rectify any such inaccuracies and/or invalidities; or
                </p>

                <p className="ml-6 mb-4">
                    3.6.2 suspend or permanently block Buyer's and its Users' access to and use of the Platform in accordance with clause 4.6.
                </p>

                <p className="mb-4">
                    3.7 Bid Drive USA reserves at all times the right to refuse confirmation of a registration request without motivation. Bid Drive USA shall not be liable for any Losses suffered or incurred by Buyer arising out of or in connection with any such refusal.
                </p>

                <p className="mb-4">
                    3.8 If Bid Drive USA decides to approve Buyer's request for registration, Bid Drive USA will inform Buyer thereof and provide Buyer with one or more Means of Access for the Platform. Buyer shall not be able to submit any Offers until such approval by Bid Drive USA and receipt of the Means of Access.
                </p>

            </section>




            <section ref={accessRef} id="access" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">4. Platform Access and Use</h2>


                <p className="mb-4">4.1 Users and General Use</p>

                <p className="mb-4">
                    4.1.1 Buyer acknowledges and accepts that he is responsible for the actions and omissions performed by all users making use of the Platform on behalf of Buyer or otherwise via Buyer's Means of Access ("Users"). Buyer accepts subsequently that any action (f.e. an Offer) made by Users, will be considered as made on behalf of Buyer and legally binds Buyer. Buyer shall provide all Users with a copy of these Terms and Conditions, shall comply with these, and make sure each User complies with these Terms and Conditions.
                </p>

                <p className="mb-4">
                    4.1.2 Buyer warrants that the Platform is used in accordance with these Terms and Conditions, all applicable national and international legislation and, in general, in a responsible manner, exclusively for its own and admissible professional purposes and without breach of the rights of third parties. Neither Buyer nor the Users are permitted to make modifications to the Platform. Buyer is liable for and will hold harmless and indemnify Bid Drive against any Losses suffered or incurred by Bid Drive arising out of or in connection with any (i) modifications made to Platform; and/or (ii) use of the Platform in a manner that does not correspond with these Terms and Conditions.
                </p>

                <p className="mb-4">
                    4.1.3 Buyer undertakes not to use, and will ensure none of its Users uses the Platform to (i) download, send, or disseminate data containing viruses, worms, spyware, malware or any other similar malicious programs; (ii) carry out any calculations, operations or transactions that may interrupt, destroy or restrict the functionality of the operation of the Platform or any program, computer or means of telecommunications; (iii) submit any information or materials which infringe third party rights, are libellous, obscene, threatening or otherwise unlawful; and/or (iv) submit any non-binding Offers.
                </p>

                <p className="mb-4">4.2 Required hardware, software and services</p>

                <p className="mb-4">
                    Buyer acknowledges and agrees that it is responsible for the choice, purchase and operation of the hardware, software and/or telecommunication services required to connect with and to use the Platform. Such hardware, software and/or telecommunication services need to meet the minimum requirements as may be specified from time to time on the Platform. Buyer is responsible for the installation and related costs of purchasing and/or licensing such hardware, software and/or telecommunication services. Bid Drive is not liable for hardware, software, products and services of third parties, such as telecommunication equipment, internet connections, operating systems and internet browsers.
                </p>

                <p className="mb-4">4.3 Security and Means of Access</p>

                <p className="mb-4">
                    4.3.1 Use of the Platform requires Means of Access. Means of Access are strictly personal and Buyer is responsible for the safeguarding, confidentiality, security and appropriate use of the Means of Access by him and its Users and undertakes to take all steps to prevent any unauthorized third party from gaining knowledge and making use thereof. Buyer shall not transfer or sell any Means of Access to any third party, except Users who are duly authorised to act on its behalf.
                </p>

                <p className="mb-4">
                    4.3.2 Buyer will notify Bid Drive immediately by email or fax of the loss, theft, breach of confidentiality or any risk of misuse of the Means of Access. Buyer is fully and unconditionally responsible for any use of the Platform and any Offers made, as well as for any detrimental consequences that may arise directly or indirectly therefrom, until one (1) Working Day after such notification has been made.
                </p>

                <p className="mb-4">
                    4.3.3 If Bid Drive has any reason to suspect that the confidentiality and/or security of the Means of Access has been breached or that the Platform is being misused, Bid Drive may, without prior notice, suspend access to the Platform, at its sole discretion and without opening the right for any type of compensation.
                </p>

                <p className="mb-4">
                    4.3.4 Buyer acknowledges having been warned that Bid Drive reserves the right to refuse access to a User using Means of Access when a session is already open on another computer where another User is using the same Means of Access.
                </p>

                <p className="mb-4">
                    4.3.5 Bid Drive has the right to suspend for a definite or indefinite period any account for any reason. This includes, without limitation, the delay in car payment, suspicious behaviour, suspicion of fraud or VAT carousel or any other type of reason that Bid Drive does not need to communicate to Buyer.
                </p>

                <p className="mb-4">
                    4.3.6 Bid Drive shall not be liable for any Losses suffered or incurred by Buyer arising out of or in connection with any such suspended or refused access as described in clauses 4.3.3, 4.3.4, and 4.3.5.
                </p>

                <p className="mb-4">4.4 Platform services fees</p>

                <p className="mb-4">
                    Bid Drive may, from time to time, offer certain services via the Platform which are subject to payment of the applicable fees by Buyer, and/or require payment of a fee by Buyer for existing services. The applicable fees shall be indicated via the Platform and may vary from time to time. Buyer shall be solely responsible to verify the applicable fees each time Buyer (or its Users) access and use the Platform and/or services offered via the Platform.
                </p>

                <p className="mb-4">4.5 Intellectual property rights</p>

                <p className="mb-4">
                    4.5.1 The intellectual and industrial property rights and know-how associated with the Platform belong exclusively to Bid Drive. Bid Drive grants Buyer and its Users a non-transferable, limited, non-exclusive license to use the Platform for Buyer's own business purposes only, until Bid Drive blocks Buyer's and/or its Users' access to the Platform.
                </p>

                <p className="mb-4">
                    4.5.2 Buyer shall take all necessary measures to protect and ensure that its Users protect Bid Drive's intellectual and industrial property rights.
                </p>

                <p className="mb-4">
                    4.5.3 Without prejudice to the rights of Buyer and Users under the legislation relating to the protection of computer programs of which cannot be contractually deviated, Buyer and its Users may not: (i) modify, translate or adapt the Platform in any way; (ii) decompile or disassemble the Platform in any way; (iii) copy the Platform in any way; (iv) pass on, dispose of, grant as a sub-license, lease, lend or distribute the Platform or documentation in any way to third parties; (v) create any product or service substantially similar to the Platform; and/or (vi) copy any ideas, characteristics and/or functions of the Platform. Bid Drive reserves the sole right to correct any errors.
                </p>

                <p className="mb-4">4.6 Suspension and blocking</p>

                <p className="mb-4">
                    4.6.1 Buyer acknowledges and agrees that Bid Drive reserves the right to suspend Buyer's and its Users' access to the Platform for any reason, including without limitation (i) in case of actual or reasonably suspected breach by Buyer and/or its Users of these Terms and Conditions; (ii) in case of an attack on Bid Drive's IT systems; (iii) if legally required; (iv) so as to avoid or mitigate any detrimental impact on Bid Drive, Buyer and/or the Buyer Community; and (v) for purposes of Platform maintenance. Bid Drive will use reasonable efforts to inform Buyer of such suspension as soon as practically possible.
                </p>

                <p className="mb-4">
                    4.6.2 Buyer acknowledges and agrees that Bid Drive reserves the right to permanently block Buyer's and its Users' access to the Platform (i) in case of breach by Buyer and/or its Users of these Terms and Conditions; (ii) in the circumstances described in clause 12; and (iii) in case of fraudulent practices of Buyer and/or its Users; (iv) for any other reason at the discretion of Bid Drive.
                </p>
            </section>



            <section ref={auctionsRef} id="auctions" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">5. Auctions and Offers</h2>

                <p className="mb-2">
                    5.1.1 The Platform provides Sellers with the possibility to advertise Vehicles which they intend to sell. Such Vehicles may, at Bid Drive's sole discretion, be advertised separately or combined into one or more sets of Vehicles.
                </p>

                <p className="mb-2">
                    5.1.2 Each member of the Buyer Community has the possibility to submit a binding offer for the purchase of such set of Vehicles from Bid Drive, by submitting an Offer (Purchase price out of Taxes and costs) at which such member of the Buyer Community offers to purchase such Vehicles from Bid Drive ("Buyer Community Offers").
                </p>

                <p className="mb-2">
                    5.1.3 Buyer Community Offers will be assessed by Bid Drive until after Auction Closing and Bid Drive will determine, in its sole discretion, if it is willing to sell such set of Vehicles to the member of the Buyer Community which submitted the best offer. Buyer expressly acknowledges and agrees that its Offer may be excluded from this assessment if Bid Drive reasonably considers that its Offer is incorrect (for example and without limitation in case of an abnormally high price). Bid Drive shall not be liable for any Losses suffered or incurred by Buyer arising out of or in connection with any such exclusion.
                </p>

                <p className="mb-2">
                    5.1.4 Buyer expressly acknowledges and agrees that any sale (independently of the auction type in which it was advertised) of any Vehicle by Bid Drive to any member of the Buyer Community is dependent on Seller agreeing to sell the Vehicle to Bid Drive, and that submission of the best Buyer Community Offer does not guarantee that Buyer will be able to purchase the Vehicle.
                </p>

                <p className="mb-2">
                    5.1.5 Neither Bid Drive nor the Seller shall be liable for any Losses suffered or incurred by Buyer arising out of or in connection with any decision from Seller or Bid Drive to cancel or otherwise not proceed with an Auction at any time.
                </p>

                <p className="mb-2">
                    5.1.6 Buyer shall be informed of the applicable Auction Fees, Country Fees, and Seller Fees for each Vehicle that is part of the Auction, via the Platform. Buyer expressly acknowledges and agrees that the Auction Fees, Country Fees, and Seller Fees may vary per Vehicle and per Auction.
                </p>

                <h2 className="text-xl font-bold mt-4 mb-4">5.2 Offers</h2>

                <p className="mb-2">
                    5.2.1 In case Buyer wishes to purchase a (set of) Vehicle(s), Buyer has the option to submit an Offer for the purchase of such Vehicle(s). An Offer shall always consist of the Purchase price excluding taxes and costs Buyer is offering to pay for such Vehicles to Bid Drive ("Offered Price").
                </p>

                <p className="mb-2">
                    5.2.2 Buyer expressly acknowledges and agrees that any Offer submitted via the Platform shall constitute a binding offer, which cannot be withdrawn by Buyer until expiry of a period of two (2) Working Days as from Auction Closing unless another term is mentioned on the website.
                </p>

                <p className="mb-2">
                    5.2.3 In case Buyer submits more than one (1) Offer for the same Vehicle, only the highest Offer of Buyer will be taken into account by Bid Drive.
                </p>

                <p className="mb-2">
                    5.2.4 Buyer acknowledges and agrees that submission and acceptance of Offers shall always be subject to the applicable Auction Rules.
                </p>

                <p className="mb-2">
                    5.2.5 Buyer and its Users shall not manipulate the price of any Vehicle advertised during an Auction and shall not in any way interfere with offers made by other members of the Buyer Community.
                </p>

            </section>

            <section ref={salesRef} id="sales" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">6. nationwide-motors USA Sales</h2>

                <p className="mb-2">
                    6.1.1 If (i) Buyer's Offer is deemed to be the best Buyer Community Offer in accordance with clause 6.1.3, (ii) Bid Drive is able to purchase the Vehicle(s) concerned from Seller and (iii) Bid Drive decides to accept such Offer in accordance with clause 5.1.3, Bid Drive sells the Vehicle(s) concerned to Buyer ("Bid Drive Sale"). The Vehicle(s) shall be sold at the Offered Price, to be increased with the Auction Fees, Country Fees, Seller Fees, Transport Fees and all applicable Taxes.
                </p>

                <p className="mb-2">
                    6.1.2 In such case, Bid Drive will inform Buyer of the Bid Drive Sale ("Sale Confirmation"), and Buyer is required to complete the order form via the Platform with the administrative delivery details ("Order Completion") of the Bid Drive Sale within one working day as from receipt of the Sale Confirmation. Buyer expressly acknowledges and agrees that the Order Completion is an administrative formality to organise delivery and shall not be construed as a possibility for Buyer to cancel its Offer and/or otherwise cancel the Bid Drive Sale.
                </p>

                <p className="mb-2">
                    6.1.3 In the Order Completion, Buyer shall provide in any case the country of destination of the purchased Vehicle(s). Buyer shall be solely responsible for any costs, expenses, Taxes and any other consequences related to its choice of country of destination. Bid Drive shall not be liable for any Losses suffered or incurred by Buyer arising out of or in connection with the chosen country of destination.
                </p>

                <h2 className="text-xl font-bold mt-4 mb-4">6.2 Payment and Invoicing of Bid Drive Sales</h2>

                <p className="mb-2">
                    6.2.1 For each Bid Drive Sale, the Offered Price will be increased with all Taxes which shall be payable by Buyer. The Taxes will include the VAT due, if any, in the country of residence of the member of Bid Drive invoicing the Bid Drive Sale. In case of an Intra-Community Supply or Export, and as far as there is sufficient Evidence of the transport of the Vehicle, no VAT will be due on the Bid Drive Sale and Buyer will be liable to account for the VAT due in the country of destination.
                </p>

                <p className="mb-2">
                    Unless the Vehicle is at the time of the sale located in Belgium, the Intra-Community Supplies are treated for VAT purposes as a “Triangulation Scheme” (cf. so-called ABC transactions). This implies that the Buyer shall take care, in the EU Member State of arrival, of the required VAT formalities as the last link in the chain (cf. party C).
                </p>

                <p className="mb-2">
                    6.2.2 At the time Bid Drive informs Buyer of the Bid Drive Sale under clause 6.1.2, Bid Drive will provide Buyer with an order form, which sets out (i) the Purchase Price, consisting of the Offered Price, the Auction Fees, the Country Fees, the Seller Fees, the Transport Fees and any applicable Taxes; and (ii) any guarantee payable by Buyer pursuant to clause 7.4.2. Buyer shall ensure that the Purchase Price is credited to the bank account of Bid Drive as specified on the order form at the latest two (2) Working Days after submission of the Bid Drive Sale Confirmation.
                </p>

                <p className="mb-2">
                    6.2.3 Bid Drive will issue the invoice for each Bid Drive Sale after receipt of the Purchase Price on Bid Drive's bank account.
                </p>
            </section>

            <section ref={transportRef} id="transport" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">7. Transport and Delivery of Vehicles and Vehicle Documents</h2>
                <p className="mb-2">
                    7.1.1 Transport of the Vehicle will be performed by or on behalf of Bid Drive. At Buyer's option, Buyer is entitled to take care of the transport of the Vehicle on behalf of Bid Drive.
                </p>

                <p className="mb-2">
                    7.1.2 Any Vehicle shall, and may only be, transported to the country of destination as indicated on the Order Completion form. Buyer is liable for and will hold harmless and indemnify Bid Drive against any Losses suffered or incurred by Bid Drive arising out of or in connection with transport of a Vehicle to any country other than the country of destination as indicated on the Order Completion form.
                </p>

                <p className="mb-2">
                    7.1.3 Property of the Vehicle shall transfer at the sending of the Vehicle Documents to Buyer. The Property is not transferred at pickup, but only after approval of the FCMR (delivery evidence) by Bid Drive. Risk related to the Vehicle shall transfer at the earliest of (i) pick-up of the Vehicle by Buyer; (ii) delivery of the Vehicle at the destination indicated by Buyer; and (iii) expiry of a two (2) weeks period (or such shorter period as set out on the Pickup Authorization document) as from receipt of the Pickup Authorization document.
                </p>

                <h2 className="text-xl font-bold mt-4 mb-4">7.2 Transport of Vehicles Arranged by Bid Drive</h2>

                <p className="mb-2">
                    This clause 7.2 shall apply in case Bid Drive arranges for transport of Vehicles, in addition to the Bid Drive terms and conditions relating to transport available via the Platform.
                </p>

                <p className="mb-2">
                    7.2.1 Prices for transport mentioned on the Platform are indicative and non-binding, and the actual Transport Fees for transport will depend on several criteria, including without limitation physical location of the Vehicle and type of Vehicle. Any prices mentioned on the Platform are exclusive of applicable Taxes.
                </p>

                <p className="mb-2">
                    7.2.2 Transport shall not be organised by Bid Drive until the later of (i) the moment the Purchase Price is credited to Bid Drive's bank account mentioned on the order form; and (ii) release of the Vehicle by the Seller.
                </p>

                <p className="mb-2">
                    7.2.3 Any times or dates for delivery of the Vehicles, the Pickup Authorizations, the vehicle-documents by or on behalf of Bid Drive are estimates and shall not be of the essence. Except in case of its own fraud or willful intent, Bid Drive shall not be liable for any delay in delivery. Delay in delivery of any Vehicles, Pickup Authorizations, the Vehicle Documents shall not exempt Buyer from its obligation to accept delivery.
                </p>

                <h2 className="text-xl font-bold mt-4 mb-4">7.3 Transport of Vehicles Arranged by Buyer on Behalf of Bid Drive</h2>

                <p className="mb-2">
                    This clause 7.3 shall apply in case Buyer organises transport of Vehicles on behalf of Bid Drive.
                </p>

                <p className="mb-2">
                    7.3.1 The Vehicle shall not be available for pick-up and transportation until the later of (i) the moment the Purchase Price is credited to Bid Drive's bank account mentioned on the order form; (ii) release of the Vehicle by the Seller; and (iii) issuance of the pick-up authorization document(s) to Buyer.
                </p>

                <p className="mb-2">
                    7.3.2 Buyer shall pick up and transport the Vehicle at the latest within two (2) weeks (or such shorter time frame as set out on the pick-up authorization document) of receipt of the pick-up authorization document. Buyer acknowledges and agrees that Bid Drive, Seller, or the third party storing the Vehicle on their behalf, has at all times the right to refuse delivery of a Vehicle to Buyer (or Buyer's transporter, as applicable) in case Buyer (or Buyer's transporter, as applicable) does not present a valid pick-up authorization document and an official proof of identification such as passport or driver’s license. The Buyer accepts that Bid Drive has the right to take a copy of the proof of identification presented by the Buyer. If the Buyer mandates a third party or a transporting firm to pick up the vehicle, the Buyer will ensure that the third party or transporting firm agrees to the aforementioned obligations relating to the pick-up authorization, identification of the person who picks up the vehicle and the right of Bid Drive to copy the proof of identification. Buyer shall be fully responsible for any Losses incurred by Buyer, Bid Drive, Seller, transporting firm, and the third party arising out of or in connection with such lack of valid pick-up authorization document and/or failure to provide proper identification and/or refusal to take a copy of the presented proof of identification.
                </p>

                <p className="mb-2">
                    7.3.3 In case Buyer fails to pick up the Vehicle within:
                </p>

                <p className="ml-6 mb-2">
                    (a) two (2) weeks (or such shorter time frame as set out on the pick-up authorization document) of receipt of the pick-up authorization document, Bid Drive reserves the right to charge Buyer an amount of fifty euros (EUR 50.00) administration costs and a minimum of five euros (EUR 5.00) per day until pick-up of the Vehicle;
                </p>

                <p className="ml-6 mb-2">
                    (b) one (1) month of the reception of the pick-up authorization document, the Bid Drive Sale shall be deemed wrongfully cancelled by Buyer in accordance with clause 12.4.
                </p>

                <h2 className="text-xl font-bold mt-4 mb-4">7.4 Proof of Transport and Vehicle Documents</h2>

                <p className="mb-2">
                    7.4.1 Intra-Community Supply
                </p>

                <p className="ml-6 mb-2">
                    (a) In case of Intra-Community Supply, Buyer shall submit to Bid Drive all required Evidence and Transport Documents regarding the Vehicle and the country of destination duly completed.
                </p>

                <p className="ml-6 mb-2">
                    (b) Buyer acknowledges and agrees that:
                </p>

                <p className="ml-8 mb-2">
                    (i) regardless of whether transport was arranged for by or on behalf of Bid Drive, in case Bid Drive reasonably doubts the validity or completeness of the Transport Documents submitted by Buyer, Bid Drive reserves the right to retain the Vehicle Documents until such time as Buyer submits valid Evidence; and
                </p>

                <p className="ml-8 mb-2">
                    (ii) Bid Drive shall not deliver the Vehicle Documents until receipt of the correctly filled out Transport Documents and Evidence.
                </p>

                <p className="mb-2">
                    7.4.2 Export
                </p>

                <p className="ml-6 mb-2">
                    (a) In case of Export, Buyer shall submit to Bid Drive all required Evidence and Export Documents regarding the Vehicle and the country of destination duly completed.
                </p>

                <p className="ml-6 mb-2">
                    (b) In case of Export, pending transfer and receipt of the necessary Export Document, Bid Drive requires, per Vehicle that is exported to a non-EU country, a guarantee equal to the sum of the VAT amount that would be due in the country of residence of the member of Bid Drive invoicing the Bid Drive Sale, in the event the Bid Drive Sale should not constitute an export for VAT purposes. The guarantee amount will be mentioned separately on the order form. The guarantee is twenty-one percent (21%) of the total amount of the Vehicle Price, Auction Fees, Country Fees, Seller Fees, Transport Fees, and all applicable Taxes and costs with a minimum of five hundred euros (EUR 500.00).
                </p>

                <p className="ml-6 mb-2">
                    (c) Upon receipt of the necessary Evidence and Export Documents by Bid Drive from Buyer, proving that the Bid Drive Sale constitutes an export for VAT purposes, the amount of the guarantee will be reimbursed to the Buyer’s bank account and the Bid Drive Sale will be invoiced to Buyer without VAT.
                </p>

                <p className="mb-2">
                    7.4.3 Save in case of its own fraud or willful intent, Bid Drive shall not be liable for any Losses suffered or incurred by Buyer (including without limitation inability to register the Vehicle) arising out of or in connection with any missing or incomplete Vehicle Documents.
                </p>

                <h2 className="text-xl font-bold mt-4 mb-4">7.5 Sending of Car Documents</h2>

                <p className="mb-2">
                    Bid Drive will send the Vehicle Documents to the VAT registration country of Buyer after reception and validation of the delivery Evidence and after receipt in full of the Purchase Price and/or any other amount which Buyer owes to Bid Drive. Buyer keeps full responsibility for the appropriate declaration of the purchase to the authorities. Bid Drive's responsibility will in no case be engaged for any error, mistake or forgetfulness committed by Buyer in relation with applicable taxes (VAT or any other tax).
                </p>

            </section>

            <section ref={vehicleInfoRef} id="vehicleInfo" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">8. Vehicle Information</h2>
                <p className="mb-2">
                    Buyer acknowledges and agrees that it acts as a professional car dealer with thorough knowledge of the sector of used cars and the issues typically associated with used cars and the used cars business.
                </p>

                <h2 className="text-xl font-bold mt-4 mb-4">8.2 Liability Disclaimer</h2>

                <p className="mb-2">
                    Buyer acknowledges and accepts that Bid Drive's commercially advantageous offerings regarding the Platform and the related services render it impossible for Bid Drive to carry out a detailed technical inspection of every Vehicle advertised by a Seller on the Platform, and to assume responsibility in that respect. Buyer acknowledges and accepts that all Vehicle Information is based on the information obtained from the Seller.
                </p>

                <p className="mb-2">
                    To the maximum extent permitted by law, without prejudice to clause 9, and save in case of its own fraud or wilful intent, Bid Drive shall not be responsible for, and not be liable for any Losses suffered or incurred by Buyer arising out of or in connection with any inaccuracy in or incompleteness of the Vehicle Information (including without limitation in relation to mileage, damage, technical faults, optional extras, colour, year of manufacture, date of first registration, etc.).
                </p>

                <p className="mb-2">
                    To the maximum extent permitted by law, Bid Drive expressly excludes any liability for Losses arising out of or in connection with third party fraud (including without limitation mileage, margin status and/or chassis number fraud).
                </p>

                <h2 className="text-xl font-bold mt-4 mb-4">8.3 Vehicle Information Types</h2>

                <p className="mb-2">
                    Vehicle Information may, depending on the Vehicle, consist of one or more types of information, each of which shall be clearly identified as such on the Platform, including the following:
                </p>

                <p className="ml-6 mb-2">
                    8.3.1 the Bid Drive Vehicle Description; and
                </p>

                <p className="ml-6 mb-2">
                    8.3.2 reports from external third parties and photos.
                </p>

                <h2 className="text-xl font-bold mt-4 mb-4">8.4 Acknowledgments by Buyer</h2>

                <p className="mb-2">
                    Buyer expressly acknowledges that:
                </p>

                <p className="ml-6 mb-2">
                    8.4.1 each of these types of information are made or created at different points in time, and may as such not always correctly reflect the status of the Vehicle at the moment of the sale of the Vehicle occurs;
                </p>

                <p className="ml-6 mb-2">
                    8.4.2 Buyer has no access over any Vehicle Information other than the Bid Drive Vehicle Description and as a result, any such other Vehicle Information is provided for Buyer's convenience only;
                </p>

                <p className="ml-6 mb-2">
                    8.4.3 to determine if the Vehicle as delivered to Buyer is in conformity, only the Bid Drive Vehicle Description shall be taken into account; and
                </p>

                <p className="ml-6 mb-2">
                    8.4.4 in case of any conflict or ambiguity between the Bid Drive Vehicle Description and any other Vehicle Information, the Bid Drive Vehicle Description shall always prevail.
                </p>
            </section>

            <section ref={warrantyRef} id="warranty" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">9. Limited Warranty</h2>
                <p className="mb-2">
                    For Vehicles which are not designated as "wrecked cars", “technical damaged cars”, “body damaged cars” and “accident cars” during the Auction, and always subject to clause 10.5, Bid Drive solely warrants that on the date of delivery the Vehicle conforms to the Bid Drive Vehicle Description. If and to the extent a Vehicle fails to meet such warranty, as shall be determined in accordance with clause 10, Bid Drive has the right to issue a credit note for any such Vehicle in the amount of the reasonably estimated decrease in value of the Vehicle resulting from the damage to the Vehicle which was not indicated in the Bid Drive Vehicle Description. In the event Bid Drive makes such credit, such credit amount shall be Buyer's sole remedy.
                </p>

                <p className="mb-2">
                    The validity of any warranty claim by Buyer shall be contingent upon receipt by Bid Drive of timely notice of any alleged non-conformance of the Vehicle in accordance with clause 10.
                </p>

                <p className="mb-2">
                    For Vehicles which are designated as "wrecked cars", “technical damaged cars”, “body damaged cars” and “accident cars” during the Auction, Buyer expressly acknowledges and agrees that, to the maximum extent permitted by applicable law, Bid Drive provides no warranty of any kind, including without limitation any warranty of conformity or merchantability.
                </p>

                <p className="mb-2">
                    The warranty set out in this clause 9 is exclusive and in lieu of all other warranties, representations, conditions or other terms, express, implied, statutory, contractually or otherwise, including, without limitation, any warranty of merchantability or suitability or fitness for any purpose.
                </p>

                <p className="mb-2">
                    The warranty set out in this clause 9 shall not apply if and to the extent the non-conformity results from (i) modifications made to and any other works performed on the Vehicle by or on behalf of Buyer; and/or (ii) use of the Vehicle by or on behalf of Buyer other than with reasonable care and skill.
                </p>
            </section>

            <section ref={conformityRef} id="conformity" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">10. Conformity and Complaints</h2>
                <p className="mb-2">
                    On delivery of the Vehicle, Buyer shall examine (or have examined on its behalf) the Vehicle and satisfy itself that the Vehicle complies with the Bid Drive Vehicle Description. During such examination, Buyer shall at all times take into account (i) the fact that Buyer purchased a used vehicle; (ii) the Vehicle's mileage; and (iii) the Vehicle's first registration date. Defects in or damage to parts of the Vehicle do not entitle Buyer to reject the entire Vehicle.
                </p>

                <h2 className="text-xl font-bold mt-4 mb-4">10.2 Complaints about the Vehicle</h2>

                <p className="mb-2">
                    Complaints about the Vehicle shall be made using the Bid Drive complaints form and:
                </p>

                <p className="ml-6 mb-2">
                    10.2.1 in respect of any defect or damage which would be apparent from a reasonable inspection on delivery, shall be mentioned on CMR and/or consignment note;
                </p>

                <p className="ml-6 mb-2">
                    10.2.2 in respect of any hidden defect or damage, shall be made at the latest before the earlier of (i) expiry of a three (3) days period after delivery; and (ii) Buyer (or any other third party under Buyer's control) having driven no more than one hundred kilometres (100 km) after delivery of the Vehicle.
                </p>

                <p className="ml-6 mb-2">
                    10.2.3 in respect of the Vehicle Documents, shall be made at the latest 1 hour after the delivery of the documents.
                </p>

                <h2 className="text-xl font-bold mt-4 mb-4">10.3 Substantiation of Complaints</h2>

                <p className="mb-2">
                    Any complaint must be thoroughly substantiated with all evidence necessary for Bid Drive or any third party to be able to determine the non-conformity of the Vehicle. For any external damage, Buyer shall provide clear pictures, together with an estimate of the value of the damage. For technical problems, Buyer shall notify the defect in accordance with clause 10.2 and as soon as possible thereafter (and in no case more than one (1) week after submission of the complaint) submit to Bid Drive a document from an official workshop or dealer which describes the technical damage and lists the ID numbers of the required spare parts.
                </p>

                <h2 className="text-xl font-bold mt-4 mb-4">10.4 Exclusions</h2>

                <p className="mb-2">
                    Pursuant to clause 9.2, to the maximum extent permitted by applicable law, no complaints can be made for Vehicles designated as "wrecked cars", “technical damaged cars”, “body damaged cars” and “accident cars” during the Auction.
                </p>

                <h2 className="text-xl font-bold mt-4 mb-4">10.5 Acknowledgment of Claim Policy</h2>

                <p className="mb-2">
                    Buyer acknowledges that he has read and accepted Bid Drive’s claim policy – which is accessible in Buyer’s ‘My Account’ and on Bid Drive’s website – which contains more detailed information relating to the admissibility of claims regarding the condition and/or description of a Vehicle.
                </p>
            </section>

            <section ref={liabilityRef} id="liability" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">11. Liability</h2>
                <p className="mb-2">
                    To the maximum extent permitted by applicable law, and subject to clause 11.3, Bid Drive shall not be liable for any direct or indirect or consequential damage of any kind, including without limitation disruption of business, third party claims, and loss of profits, anticipated savings, or goodwill.
                </p>

                <p className="mb-2">
                    To the maximum extent permitted by applicable law, subject to clause 11.3, and to the extent clause 11.1, and/or any other limitations and exclusions of liability set out in these Terms and Conditions do not apply, Bid Drive's total aggregate liability for any Losses of any nature incurred or suffered by Buyer arising out of or in connection with a Bid Drive Sale, shall not exceed the Offered Price for such Bid Drive Sale.
                </p>

                <p className="mb-2">
                    For any other Losses incurred or suffered by Buyer shall, in each calendar year, in the exceptional event Bid Drive's responsibility is undiscutably proven, be limited to the higher of (i) the Auction Fees and Country Fees paid by Buyer in such calendar year; and (ii) one thousand euros (EUR 1,000.00).
                </p>

                <p className="mb-2">
                    Neither Party shall exclude or limit its liability for (i) its own fraud or wilful intent; and/or (ii) any liability which cannot be excluded or limited under applicable law (in which case the relevant Party does not exclude or limit its liability only to the extent such exclusion or limitation is not permitted by applicable law).
                </p>
            </section>

            <section ref={blockingRef} id="blocking" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">12. Blocking and Cancellations</h2>
                <p className="mb-2">
                    Buyer does not have the right to cancel a Bid Drive Sale or any other order of an additional service for its convenience.
                </p>

                <p className="mb-2">
                    If Buyer fails to comply with these Terms and Conditions, Buyer acknowledges and agrees that, without prejudice to Bid Drive's other rights and remedies under these Terms and Conditions, at law or otherwise, Bid Drive reserves the right to temporarily or definitively block Buyer and its Users from accessing and using the Platform in any way. In such case,
                </p>

                <p className="mb-2">
                    Bid Drive will undertake reasonable efforts to inform Buyer of such blocking; and Bid Drive may, in its sole discretion, decide to unblock Buyer and its Users subject to completion of a verification and validation process. This could be subject to payment of a reinstatement fee by Buyer.
                </p>

                <p className="mb-2">
                    If, notwithstanding clause 12.1, Buyer wishes to cancel a Bid Drive Sale, Buyer may request such cancellation in writing or via e-mail. Buyer acknowledges and agrees that Bid Drive may, in its sole discretion, decide to refuse or allow such cancellation. If Bid Drive agrees to allow Buyer to cancel the Bid Drive Sale, Buyer shall pay to Bid Drive (i) all Auction Fees and Country Fees increased with applicable Taxes relating to such Bid Drive Sale; and (ii) ten per cent (10%) of the Offered Price; with a minimum of three hundred euros (EUR 300.00) relating to such Bid Drive Sale.
                </p>

                <p className="mb-2">
                    Buyer does not have the right to cancel an additional service. If Buyer decides to cancel a Bid Drive Sale, he will not be entitled to any kind of refund for additional services already paid.
                </p>
            </section>

            <section ref={invoicingRef} id="invoicing" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">13. Invoicing and Payment</h2>
                <p className="mb-2">
                    This clause 13 shall apply to all fees and charges due by Buyer pursuant to a Bid Drive Sale or otherwise under these Terms and Conditions and any invoicing and payment thereof.
                </p>

                <p className="mb-2">
                    Unless expressly stated otherwise, any fees, charges and amounts mentioned on the Platform and in these Terms and Conditions shall be in euros and exclusive of any applicable Taxes.
                </p>

                <p className="mb-2">
                    Buyer acknowledges and agrees that any invoicing shall occur via E-Invoices and that Buyer shall not receive paper invoices. Buyer acknowledges and agrees that it is responsible for the fulfilment of all applicable legal requirements with respect to receipt and storage of E-Invoices.
                </p>

                <p className="mb-2">
                    As an exception to the foregoing, Buyer can in the Order Completion form, opt to choose for paper invoices in which case all invoices issued by Bid Drive to Buyer as from that moment shall be paper invoices.
                </p>

                <p className="mb-2">
                    Buyer expressly acknowledges and accepts that Bid Drive shall charge an administrative fee for each paper invoice requested by Buyer, and such amount shall be added to each invoice. This fee will be shown during order completion on the website.
                </p>

                <p className="mb-2">
                    In case Buyer wishes to change its invoicing preferences after its first Bid Drive Sale, Buyer shall contact Bid Drive in accordance with clause 16.3.
                </p>

                <p className="mb-2">
                    Without prejudice to Bid Drive's rights and remedies under these Terms and Conditions, at law or otherwise, if payment has not been credited to the bank account of Bid Drive within the applicable payment term, Bid Drive is entitled to charge Buyer interest on overdue amounts, without prior notice, at a rate equal to the interest rate applicable under the Belgian Law of 2 August 2002 regarding late payment in commercial transactions.
                </p>

                <p className="mb-2">
                    Within two (2) weeks of confirmation of the Bid Drive Sale by Bid Drive, the Bid Drive Sale shall be deemed wrongfully cancelled by Buyer in accordance with clause 12.3.
                </p>

                <p className="mb-2">
                    In case there are unpaid amounts emitted to Buyer, Bid Drive will have the right to block any other amount, Vehicle Documents or Vehicle in his possession, without advance notice, to compensate the unpaid amount. The blocked amount, Vehicle Documents or Vehicle shall not be limited to the same transactions but will be extended to all the open transactions between Bid Drive and Buyer.
                </p>

                <p className="mb-2">
                    Bid Drive reserves the right to refuse a payment if the payment is made from a bank account which does not belong to Buyer and/or from a bank account that is registered in a country which is not the same country as the one where Buyer is inscribed in the trade register.
                </p>

                <p className="mb-2">
                    The non-payment of a debt on its due date will give Bid Drive the right to postpone any further delivery of goods and/or services automatically and without notice of default and will render the following automatically and without notice of default: (1) the immediate claimability of all outstanding invoices, both from Bid Drive and our ancillary firms and (2) novation and/or bilateral and/or multilateral settlement by offsetting, both with regards to Bid Drive and our ancillary firms. By ‘ancillary firms’ is to be understood: companies belonging to the same group, on the understanding that proof of this can be provided by all legal means.
                </p>

                <p className="mb-2">
                    Buyer is to wholly pay the Vehicle. In case of partial payments for one Vehicle, Buyer acknowledges and accepts that Bid Drive shall charge additional fees.
                </p>
            </section>

            <section ref={privacyRef} id="privacy" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">14. Privacy Policy</h2>
                <p>14.1 The policy includes important information about how nationwide-motors USA collects and treats your data.

                <Link to='/footer/privacy' className='text-blue-600  hover:underline' >
                    Feel free to review our privacy policy here.
                </Link> 
                
                </p>
            </section>

            <section ref={variationsRef} id="variations" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">15. Variations</h2>
                <p className="mb-2">
                    Bid Drive may, at any time, amend, modify, add or delete any provision of these Terms and Conditions.
                </p>

                <p className="mb-2">
                    Bid Drive will issue any such amended or new terms and conditions subject to a notice period of at least seven (7) calendar days. Buyer expressly acknowledges and agrees that such varied or new terms and conditions can be notified by Bid Drive to Buyer via electronic means, including via e-mail and/or notice on the Platform.
                </p>

                <p className="mb-2">
                    The amended or new terms and conditions shall apply and be deemed accepted by Buyer as from the date set out by Bid Drive, unless Buyer notifies Bid Drive in writing within the given notice period of its refusal to accept such varied or new terms and conditions. In such case, Bid Drive reserves the right to terminate these Terms and Conditions immediately without any compensation being due by Bid Drive in such respect, and to block Buyer and its Users' access and use of the Platform.
                </p>
            </section>

            <section ref={miscellaneousRef} id="miscellaneous" className="mb-8">
                <h2 className="text-xl font-semibold mb-2">16. Miscellaneous</h2>
                <p className="mb-2">
                    Bid Drive registers access to and use of the Platform. This access and use log provides evidence that access has been gained to and use has been made of the Platform, unless Buyer can prove the contrary. Electronic messages, connections, operations on the network and transactions between Bid Drive and Buyer shall be proven using the logs and transaction files kept electronically by Bid Drive. Buyer accepts the evidential value of this data. This capability of proof does not prevent the Parties from each providing their own proof using permitted legal methods.
                </p>

                <p className="mb-2">
                    Neither Party shall be responsible for any damage caused by the non-compliance or delay in compliance of obligations resulting from a case of force majeure, external cause or any other events which are not under the reasonable control of Bid Drive.
                </p>

                <p className="mb-2">
                    Unless explicitly stated otherwise, any notices, demands and correspondence shall be sent by Buyer to Bid Drive by post to Bid Drive NV, Grijpenlaan 19A, 3300 Tienen, Belgium or by e-mail to the e-mail address given to Buyer during the Platform registration process.
                </p>

                <p className="mb-2">
                    Buyer and Bid Drive are independent contractors, and the relationship created hereby shall not be deemed to be that of principal or agent. No sale or obligation of either Party towards a third party shall in any way bind the other party.
                </p>

                <p className="mb-2">
                    Buyer is not entitled to assign these Terms and Conditions or any rights and obligations arising from these Terms and Conditions to any other party without the prior written consent of Bid Drive. Bid Drive has the right to assign these Terms and Conditions, wholly or partly, or any rights and obligations arising from these Terms and Conditions to any member of Bid Drive and/or to any third party in connection with a corporate restructuring of any member of Bid Drive, including but not limited to merger and/or acquisition.
                </p>

                <p className="mb-2">
                    Those clauses that by their nature are expressly or implicitly intended to survive the termination or expiry of these Terms and Conditions, shall so survive, including but not limited to clauses 2, 9, 10, 11, 12, 14 and 16.
                </p>

                <p className="mb-2">
                    If a provision of these Terms and Conditions is finally determined to be, or becomes, invalid, illegal or unenforceable, then such provision shall, if possible, and insofar as such clause is invalid, illegal or unenforceable, be replaced by the Parties by a valid, legal and enforceable clause reflecting as close as possible the initial intentions. If the invalid, illegal or unenforceable provision cannot be validly replaced, then no effect shall be given to said clause and it shall be deemed not to be included in these Terms and Conditions, such without affecting or invalidating the remaining provisions of these Terms and Conditions.
                </p>

                <p className="mb-2">
                    These Terms and Conditions have been drawn up in English and its provisions will be interpreted and construed in accordance with applicable law as set out in clause 16.10 and their generally accepted meanings in the English language. Any translation of these Terms and Conditions is for the convenience of the Parties only, and shall not be binding towards any Party. In the event of any inconsistency between the English original and its translation, the provisions of the English version shall prevail.
                </p>

                <p className="mb-2">
                    The rights and remedies of each Party under, or in connection with, these Terms and Conditions may be waived only by express written notice to the other Party. Any waiver shall apply only in the instance, and for the purpose for which it is given.
                </p>

                <p className="mb-2">
                    These Terms and Conditions and any Bid Drive Sale are governed by, and construed in accordance with Belgian law, without reference to the conflict of law rules. The applicability of the United Nations Convention on Contracts for the International Sale of Goods (CISG) and its protocols is excluded. The courts of Leuven, Belgium shall have exclusive jurisdiction to settle any and all disputes which may arise out of or in connection with these Terms and Conditions and/or any Bid Drive Sale.
                </p>

                <p>
                    These Terms and conditions have been reviewed on 14/08/2023.
                </p>
            </section>
        </div>
        </div>
        </MaxWidthWrapper>
    );
};

export default TermsAndConditions;
