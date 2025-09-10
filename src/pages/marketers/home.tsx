import AffiliateDasboardLayout from '../../components/layout/AffiliateDasboardLayout'

export default function MarketersHome() {
  return (
    <AffiliateDasboardLayout header='Affiliate Dashboard' showSearch={false}>
        <div>
            <div>
                <div>
                    <div>Total made today</div>
                    <div></div>
                </div>
                <div>
                    <div>Total made this week</div>
                    <div></div>
                </div>
                <div>
                    <div>Available balance</div>
                    <div></div>
                    <button>Withdraw</button>
                </div>
            </div>
            <div>
                <div>Affiliate Order History</div>
            </div>
        </div>
    </AffiliateDasboardLayout>
  )
}
