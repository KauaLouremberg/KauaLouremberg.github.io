const LazyComponent = (importStatement) => {
    const Component = lazy(importStatement);

    return (props) => (
        <Suspense fallback={
            <div>&nbsp;
                <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                    zIndex: 1,
                    position: 'relative',
                    marginTop: '33px',
                    marginLeft: '-14px'
                }}>
                </div>
            </div>
        }>
            <Component {...props} />
        </Suspense>
    );
};

const Dashboard = LazyComponent(() => import('../Dashboard'))